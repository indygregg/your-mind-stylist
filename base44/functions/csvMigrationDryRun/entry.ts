import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { parse } from 'npm:csv-parse@5.5.3/sync';

const CSV_FILES = [
  { name: 'Acuity list', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/305b10461_Acuitylist.csv', defaultSource: 'Acuity list' },
  { name: 'CRM Conscious Nap', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/ba0baaaed_CRMConsciousNap.csv', defaultSource: 'CRM Conscious Nap' },
  { name: 'CRM Contact: Colleagues', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/b943b01ad_CRMContactColleagues.csv', defaultSource: 'CRM Contact: Colleagues' },
  { name: 'Linda Clients', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/def5a1464_LindaClients.csv', defaultSource: 'Linda Clients' },
  { name: 'Roberta Updated 3/2026', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/54a61e0f0_Roberta-Updated32026.csv', defaultSource: 'Roberta Updated 3/2026' },
  { name: 'LENS Students', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/176acb139_LENSStudents.csv', defaultSource: 'LENS Students' },
  { name: 'Hypnosis Students', url: 'https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/09f5f051a_HypnosisStudents.csv', defaultSource: 'Hypnosis Students' },
];

const EXCLUDED_EMAILS = new Set([
  'jane@doe.com',
  'xfggrre@gmxb.com',
  '66@dianabykiris.fun',
  '4@arianabymishel.fun',
]);

// High-confidence typo corrections (confirmed by matching identity across files)
const TYPO_CORRECTIONS = {
  'haley@ilovevagas.com': 'haley@ilovevegas.com',
};

const PURCHASE_MAP = {
  // Exact matches
  'Pocket Mindset™': { match: 'exact', platform_item: 'Pocket Mindset™ (Subscription)', type: 'product', protected: false },
  'Cleaning Out Your Closet™': { match: 'exact', platform_item: 'Cleaning Out Your Closet™', type: 'product', protected: false },
  'LENS™': { match: 'exact', platform_item: 'LENS™ Framework', type: 'course', protected: false },
  // Likely matches
  'Hypnosis Bundle': { match: 'likely', platform_item: 'FARE Hypnosis Training Bundle', type: 'course', protected: true },
  'FARE Hypnosis Training Bundle': { match: 'likely', platform_item: 'FARE Hypnosis Training Bundle', type: 'course', protected: true },
  'Hypnosis Training Bundle': { match: 'likely', platform_item: 'FARE Hypnosis Training Bundle', type: 'course', protected: true },
  'Mind Styling Hypnosis 1.0': { match: 'likely', platform_item: 'Mind Styling Hypnosis Training', type: 'course', protected: true },
  'Webinar - Quantum Leaping Through Thought': { match: 'exact', platform_item: 'Quantum Leaping Through Thought', type: 'course' },
  'Webinar - Imposter Syndrome and Other Myths to Ditch': { match: 'exact', platform_item: 'Imposter Syndrome and Other Myths to Ditch', type: 'course' },
};

function normalizeEmail(email) {
  if (!email) return '';
  let e = email.trim().toLowerCase();
  // Apply typo corrections
  if (TYPO_CORRECTIONS[e]) e = TYPO_CORRECTIONS[e];
  return e;
}

function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

function normalizeName(name) {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
}

function parsePurchases(text) {
  if (!text) return [];
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  // 1. Fetch and parse all CSVs
  const allRows = [];
  const fileStats = [];

  for (const file of CSV_FILES) {
    const resp = await fetch(file.url);
    const text = await resp.text();
    const records = parse(text, { columns: true, skip_empty_lines: true, trim: true, bom: true });
    fileStats.push({ name: file.name, rowCount: records.length, columns: records.length > 0 ? Object.keys(records[0]) : [] });
    
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      // Normalize column names (Source -> source)
      const normalized = {};
      for (const [key, val] of Object.entries(row)) {
        normalized[key.toLowerCase().trim()] = val;
      }
      allRows.push({
        ...normalized,
        _csv_file: file.name,
        _csv_default_source: file.defaultSource,
        _csv_row_index: i,
        _raw: { ...row },
      });
    }
  }

  // 2. Process each row
  const excluded = [];
  const malformed = [];
  const sharedEmailConflicts = [];
  const mergedRecords = new Map(); // email -> merged record
  const multiEmailRows = [];

  for (const row of allRows) {
    let rawEmail = (row.email || '').trim();
    
    // Check for multi-email rows
    if (rawEmail.includes(',')) {
      const emails = rawEmail.split(',').map(e => e.trim());
      multiEmailRows.push({
        csv_file: row._csv_file,
        row_index: row._csv_row_index,
        emails,
        first_name: row.first_name,
        last_name: row.last_name,
        reason: 'Multiple emails in single field — needs manual split',
      });
      // Process first email only, flag the rest
      rawEmail = emails[0];
    }

    const email = normalizeEmail(rawEmail);

    // Check exclusions
    if (EXCLUDED_EMAILS.has(email)) {
      excluded.push({ email, name: `${row.first_name || ''} ${row.last_name || ''}`.trim(), csv_file: row._csv_file, reason: 'junk_test_spam' });
      continue;
    }

    // Check malformed
    if (!isValidEmail(email)) {
      malformed.push({ raw_email: rawEmail, name: `${row.first_name || ''} ${row.last_name || ''}`.trim(), csv_file: row._csv_file, reason: !rawEmail ? 'missing_email' : 'malformed_email' });
      continue;
    }

    const firstName = normalizeName(row.first_name);
    const lastName = normalizeName(row.last_name);
    const phone = normalizePhone(row.phone);
    const source = row._csv_default_source;
    const inColumnSource = (row.source || '').trim();
    const whatBought = (row.what_they_bought || '').trim();
    const whatInquired = (row.what_inquired_about || '').trim();
    const datePurchase = (row.date_of_purchase || '').trim();
    const followUp = (row.follow_up_actions || '').trim();
    const notes = (row.notes || '').trim();
    const address = (row.address_line1 || '').trim();
    const city = (row.city || '').trim();
    const state = (row.state || '').trim();
    const zip = (row.zip || '').trim();

    if (mergedRecords.has(email)) {
      // Merge into existing
      const existing = mergedRecords.get(email);
      
      // Check for name conflicts (shared_email_conflict)
      if (firstName && existing.first_name && firstName.toLowerCase() !== existing.first_name.toLowerCase()) {
        existing._name_conflicts = existing._name_conflicts || [];
        existing._name_conflicts.push({ file: row._csv_file, first_name: firstName, last_name: lastName });
      }
      
      // Append source
      if (source && !existing.import_sources.includes(source)) {
        existing.import_sources.push(source);
      }
      if (inColumnSource && !existing._in_column_sources.includes(inColumnSource)) {
        existing._in_column_sources.push(inColumnSource);
      }
      
      // Merge purchases
      if (whatBought && !existing.original_purchase_texts.includes(whatBought)) {
        existing.original_purchase_texts.push(whatBought);
      }
      
      // Fill blanks
      if (!existing.phone && phone) existing.phone = phone;
      if (!existing.address_line1 && address) existing.address_line1 = address;
      if (!existing.city && city) existing.city = city;
      if (!existing.state && state) existing.state = state;
      if (!existing.zip && zip) existing.zip = zip;
      if (!existing.what_inquired_about && whatInquired) existing.what_inquired_about = whatInquired;
      if (!existing.date_of_purchase && datePurchase) existing.date_of_purchase = datePurchase;
      if (followUp && existing.follow_up_actions !== followUp) {
        existing.follow_up_actions = [existing.follow_up_actions, followUp].filter(Boolean).join(' | ');
      }
      if (notes && existing.notes !== notes) {
        existing.notes = [existing.notes, notes].filter(Boolean).join(' | ');
      }
      
      // Store raw row
      existing.original_csv_rows.push({ file: row._csv_file, row_index: row._csv_row_index, data: row._raw });
      existing._merge_count++;
    } else {
      // New record
      mergedRecords.set(email, {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        address_line1: address,
        city,
        state,
        zip,
        what_inquired_about: whatInquired,
        what_they_bought: '', // Will be built from original_purchase_texts
        date_of_purchase: datePurchase,
        follow_up_actions: followUp,
        notes,
        import_sources: source ? [source] : [],
        _in_column_sources: inColumnSource ? [inColumnSource] : [],
        original_purchase_texts: whatBought ? [whatBought] : [],
        original_csv_rows: [{ file: row._csv_file, row_index: row._csv_row_index, data: row._raw }],
        _name_conflicts: [],
        _merge_count: 1,
      });
    }
  }

  // 3. Identify shared_email_conflicts (different people same email)
  // Also track ALL name appearances per email for full context
  const nameConflictRecords = [];
  for (const [email, rec] of mergedRecords) {
    if (rec._name_conflicts && rec._name_conflicts.length > 0) {
      // Gather all name appearances from all csv rows for this email
      const allNames = rec.original_csv_rows.map(r => ({
        file: r.file,
        first_name: normalizeName(r.data.first_name || r.data.First_Name || r.data.first_Name || ''),
        last_name: normalizeName(r.data.last_name || r.data.Last_Name || r.data.last_Name || ''),
      }));

      // Build all unique purchases from the raw rows
      const allPurchasesRaw = [];
      for (const text of rec.original_purchase_texts) {
        const items = parsePurchases(text);
        allPurchasesRaw.push(...items);
      }
      const uniquePurchases = [...new Set(allPurchasesRaw)];

      // Classify the conflict
      const uniqueFirstNames = [...new Set(allNames.map(n => n.first_name.toLowerCase()).filter(Boolean))];
      const uniqueLastNames = [...new Set(allNames.map(n => n.last_name.toLowerCase()).filter(Boolean))];

      let recommendation = 'manual_review';
      let reason = '';

      // Case 1: Same last name, different first name → likely family sharing email
      if (uniqueLastNames.length <= 1 && uniqueFirstNames.length > 1) {
        recommendation = 'exclude_shared_email';
        reason = 'Different first names, same last name — likely family sharing one email. Needs manual split.';
      }
      // Case 2: First/last swapped (e.g., "Christine Chapin" vs "Chapin Christine")
      else if (uniqueFirstNames.length === 2 && uniqueLastNames.length === 2) {
        const fn = uniqueFirstNames;
        const ln = uniqueLastNames;
        if ((fn[0] === ln[1] && fn[1] === ln[0]) || 
            (fn.some(f => ln.includes(f)))) {
          recommendation = 'safe_merge';
          reason = 'First/last name appear swapped across files — same person.';
        }
      }
      // Case 3: Minor typo (Levenshtein-like: one char diff)
      if (recommendation === 'manual_review') {
        if (uniqueFirstNames.length === 2) {
          const a = uniqueFirstNames[0], b = uniqueFirstNames[1];
          // Check if one is substring of other or 1 char diff
          if (a.includes(b) || b.includes(a) || Math.abs(a.length - b.length) <= 1) {
            const shorter = a.length <= b.length ? a : b;
            const longer = a.length > b.length ? a : b;
            let diffs = 0;
            for (let i = 0; i < shorter.length; i++) {
              if (shorter[i] !== longer[i]) diffs++;
            }
            diffs += longer.length - shorter.length;
            if (diffs <= 2) {
              recommendation = 'safe_merge';
              reason = `Minor name variant/typo: "${uniqueFirstNames[0]}" vs "${uniqueFirstNames[1]}" — likely same person.`;
            }
          }
        }
        // Check last name typos too
        if (recommendation === 'manual_review' && uniqueLastNames.length === 2 && uniqueFirstNames.length <= 1) {
          const a = uniqueLastNames[0], b = uniqueLastNames[1];
          if (a.includes(b) || b.includes(a)) {
            recommendation = 'safe_merge';
            reason = `Minor last name variant: "${uniqueLastNames[0]}" vs "${uniqueLastNames[1]}" — likely same person.`;
          } else {
            let diffs = 0;
            const shorter = a.length <= b.length ? a : b;
            const longer = a.length > b.length ? a : b;
            for (let i = 0; i < shorter.length; i++) {
              if (shorter[i] !== longer[i]) diffs++;
            }
            diffs += longer.length - shorter.length;
            if (diffs <= 2) {
              recommendation = 'safe_merge';
              reason = `Minor last name typo: "${uniqueLastNames[0]}" vs "${uniqueLastNames[1]}" — likely same person.`;
            }
          }
        }
      }
      // Case 4: Completely different names → likely different people
      if (recommendation === 'manual_review') {
        if (uniqueFirstNames.length > 1 && uniqueLastNames.length > 1) {
          // Check if any first name matches any last name (swap scenario already checked above)
          recommendation = 'exclude_shared_email';
          reason = 'Significantly different names — likely different people sharing email. Needs Roberta review.';
        } else {
          reason = 'Name mismatch — cannot automatically determine if same person or different people.';
        }
      }

      nameConflictRecords.push({
        email,
        all_name_appearances: allNames,
        unique_first_names: uniqueFirstNames,
        unique_last_names: uniqueLastNames,
        source_files: rec.import_sources,
        purchases: uniquePurchases,
        recommendation,
        reason,
        flag: 'shared_email_conflict',
      });
    }
  }

  // 4. Build normalized purchase map
  const allPurchaseTexts = new Set();
  const purchaseEnrollmentSummary = {};
  const unmappedPurchases = new Set();

  for (const [email, rec] of mergedRecords) {
    const allPurchases = [];
    for (const text of rec.original_purchase_texts) {
      const items = parsePurchases(text);
      allPurchases.push(...items);
    }
    // Dedupe purchases for this person
    const uniquePurchases = [...new Set(allPurchases)];
    rec.what_they_bought = uniquePurchases.join(', ');
    rec._parsed_purchases = uniquePurchases;
    
    for (const item of uniquePurchases) {
      allPurchaseTexts.add(item);
      const mapping = PURCHASE_MAP[item];
      if (mapping) {
        purchaseEnrollmentSummary[item] = purchaseEnrollmentSummary[item] || { ...mapping, count: 0 };
        purchaseEnrollmentSummary[item].count++;
      } else {
        unmappedPurchases.add(item);
      }
    }
  }

  // 5. Cross-check against existing Users and Leads
  const existingUsers = await base44.asServiceRole.entities.User.list();
  const existingUserMap = new Map();
  for (const u of existingUsers) {
    existingUserMap.set(u.email?.toLowerCase(), u);
  }

  let existingLeadCount = 0;
  const existingLeadMap = new Map();
  let leadPage = await base44.asServiceRole.entities.Lead.list('-created_date', 50);
  while (leadPage.length > 0) {
    for (const l of leadPage) {
      const e = l.email?.toLowerCase();
      if (e) existingLeadMap.set(e, l);
    }
    existingLeadCount += leadPage.length;
    if (leadPage.length < 50) break;
    leadPage = await base44.asServiceRole.entities.Lead.list('-created_date', 50, existingLeadCount);
  }

  // 6. Classify each merged record
  const willCreate = [];
  const willUpdateLead = [];
  const willUpdateUser = [];
  const alreadyExists = [];

  for (const [email, rec] of mergedRecords) {
    const existingUser = existingUserMap.get(email);
    const existingLead = existingLeadMap.get(email);

    if (existingUser) {
      willUpdateUser.push({
        email,
        name: `${rec.first_name} ${rec.last_name}`.trim(),
        user_id: existingUser.id,
        existing_name: existingUser.full_name,
        new_sources: rec.import_sources,
        purchases: rec._parsed_purchases,
        action: 'append_sources_to_existing_user',
      });
    } else if (existingLead) {
      willUpdateLead.push({
        email,
        name: `${rec.first_name} ${rec.last_name}`.trim(),
        lead_id: existingLead.id,
        existing_name: `${existingLead.first_name || ''} ${existingLead.last_name || ''}`.trim(),
        new_sources: rec.import_sources,
        purchases: rec._parsed_purchases,
        action: 'update_existing_lead',
      });
    } else {
      willCreate.push({
        email,
        name: `${rec.first_name} ${rec.last_name}`.trim(),
        sources: rec.import_sources,
        purchases: rec._parsed_purchases,
        merge_count: rec._merge_count,
      });
    }
  }

  // 7. Source breakdown
  const sourceBreakdown = {};
  for (const [email, rec] of mergedRecords) {
    for (const src of rec.import_sources) {
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    }
  }

  // 8. Check for mode parameter
  const body = await req.json().catch(() => ({}));
  const mode = body.mode || 'full';

  if (mode === 'conflicts_only') {
    return Response.json({
      total_conflicts: nameConflictRecords.length,
      conflicts: nameConflictRecords,
      summary_by_recommendation: {
        safe_merge: nameConflictRecords.filter(r => r.recommendation === 'safe_merge').length,
        exclude_shared_email: nameConflictRecords.filter(r => r.recommendation === 'exclude_shared_email').length,
        manual_review: nameConflictRecords.filter(r => r.recommendation === 'manual_review').length,
      },
    });
  }

  // Full report
  const report = {
    summary: {
      total_raw_rows: allRows.length,
      total_unique_emails: mergedRecords.size,
      total_excluded: excluded.length,
      total_malformed: malformed.length,
      total_shared_email_conflicts: nameConflictRecords.length,
      total_multi_email_rows: multiEmailRows.length,
      total_merged_from_multiple_csvs: [...mergedRecords.values()].filter(r => r._merge_count > 1).length,
      will_create_new: willCreate.length,
      will_update_existing_lead: willUpdateLead.length,
      will_update_existing_user: willUpdateUser.length,
      existing_users_in_system: existingUsers.length,
      existing_leads_in_system: existingLeadCount,
    },
    source_breakdown: sourceBreakdown,
    purchase_mapping: {
      exact_matches: Object.entries(purchaseEnrollmentSummary).filter(([,v]) => v.match === 'exact').map(([k,v]) => ({ csv_value: k, platform_item: v.platform_item, type: v.type, count: v.count, protected: v.protected || false })),
      likely_matches: Object.entries(purchaseEnrollmentSummary).filter(([,v]) => v.match === 'likely').map(([k,v]) => ({ csv_value: k, platform_item: v.platform_item, type: v.type, count: v.count, protected: v.protected || false })),
      unmapped: [...unmappedPurchases],
    },
    exclusions: excluded,
    malformed_emails: malformed,
    shared_email_conflicts: nameConflictRecords,
    multi_email_rows: multiEmailRows,
    will_create: willCreate.slice(0, 20),
    will_create_total: willCreate.length,
    will_update_leads: willUpdateLead,
    will_update_users: willUpdateUser,
    file_stats: fileStats,
  };

  return Response.json(report);
});