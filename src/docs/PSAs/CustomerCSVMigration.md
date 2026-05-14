# Atlas — Customer CSV Migration into Client Hub (Users, not Leads)

**Status:** Planning  
**Owner:** Indy (technical) / Roberta (operational approval)  
**Created:** 2026-05-14  

---

## Overview

Roberta has provided multiple CSV files of existing customers/students/contacts who should be loaded into Your Mind Stylist as actual customer/user records, not just leads.

This is a migration workflow. Do not treat this as a simple lead import.

---

## Files Provided

| File | Description |
|------|-------------|
| Acuity list.csv | 309 rows — Acuity scheduling contacts |
| CRM Conscious Nap.csv | 560 rows — Conscious Napping® / FARE Hypnosis customers |
| CRM Contact:Colleagues.csv | 117 rows — Professional colleagues/contacts |
| Linda Clients.csv | 194 rows — Linda's client referrals |
| Roberta-Updated 3:2026.csv | 204 rows — Roberta's updated client list |
| LENS™ Students.csv | 22 rows — LENS™ program students |
| Hypnosis Students.csv | 33 rows — Hypnosis training students |

**Total raw rows: ~1,439** (before dedup)

---

## Known Columns Across Files

- email
- first_name
- last_name
- phone
- address_line1
- city
- state
- zip
- source / Source
- what_inquired_about
- what_they_bought
- date_of_purchase
- follow_up_actions
- notes

**Important:** Some files do not have a source column. In those cases, the CSV filename itself should be stored as the source/list origin.

### Source Mapping by File

| File | Source Value |
|------|------------|
| Acuity list.csv | Acuity list |
| CRM Conscious Nap.csv | CRM Conscious Nap |
| CRM Contact:Colleagues.csv | CRM Contact: Colleagues |
| Linda Clients.csv | Linda Clients |
| Roberta-Updated 3:2026.csv | Roberta Updated 3/2026 |
| LENS™ Students.csv | LENS Students |
| Hypnosis Students.csv | Hypnosis Students |

---

## GOAL

Import these records as actual customers/users in the Client Hub so Roberta can:

1. See all original CSV data inside the Client Hub
2. Know which CSV/list each person came from
3. Assign the correct course/resource/product based on what_they_bought
4. Avoid duplicate records when the same email appears in multiple lists
5. Send a custom Roberta welcome/setup email when inviting them to set a password

---

## PHASE 1 — Audit CSV Structure Before Import

Before writing data:

1. Read every CSV.
2. Return:
   - file name
   - row count
   - column names
   - missing required fields
   - duplicate emails within each file
   - duplicate emails across files
   - unique source/list names detected

3. Normalize column names:
   - `Source` and `source` should map to the same field
   - trim spaces
   - normalize email to lowercase
   - trim first_name / last_name

**Do not import until audit is complete.**

---

## PHASE 2 — Data Model Requirements

We need to preserve every CSV column.

If fields already exist on User/Lead/Customer model, map them directly:
- email
- first_name
- last_name
- phone
- address_line1
- city
- state
- zip
- source
- what_inquired_about
- what_they_bought
- date_of_purchase
- follow_up_actions
- notes

If not already present, add safe optional fields to User/customer profile record:
- import_sources: array of source/list names
- original_csv_source: string or array
- what_inquired_about: string
- what_they_bought: string or array
- date_of_purchase: string/date
- follow_up_actions: string
- import_notes / notes: string
- imported_from_csv: boolean
- imported_at: datetime
- invite_status: not_invited / invited / accepted
- invite_sent_at

**Do not overwrite existing user data unless the existing field is blank.**

### Duplicate Handling

If duplicate email appears in multiple CSVs:
- do NOT create duplicate users
- merge the record by email
- append all source/list names to import_sources
- append/merge what_they_bought values
- preserve notes/follow_up_actions from all sources if different

---

## PHASE 3 — Import as Users / Customers

**Requirement:** These people should appear in the Client Hub as customers/users, not only as Leads.

Please determine the correct Base44-safe way to create/import user records.

If Base44 does not allow creating full active User records without an invite/signup:
- create customer profile records that appear in the Users/Customers tab
- send platform invite
- mark status as "Invite sent / Pending account setup"
- once they accept invite, link their User account back to the imported customer profile

**Important:** Roberta needs them visible as customers immediately, even if they have not set their password yet.

Do not leave them hidden only in Leads.

---

## PHASE 4 — Course / Product Mapping

Use the CSV field: `what_they_bought`

Roberta needs to assign the corresponding course/product/resource they had on the previous platform.

First audit available platform items:
- Courses
- Webinars/masterclasses
- Audiobooks
- Digital books/products
- Toolkits/resources

Return a mapping table:

| CSV value | Matching platform item | Confidence |
|-----------|----------------------|------------|
| (to be populated during Phase 1 audit) | | |

Examples that may appear:
- LENS™
- Cleaning Out Your Closet™
- Conscious Napping®
- Pocket Mindset™
- Hypnosis student/training courses
- Masterclass/webinar names

**Do NOT auto-enroll/grant access until the mapping is reviewed, unless there is an exact obvious match.**

After mapping approval:
- enroll/grant access based on what_they_bought
- support multiple purchases per person
- avoid duplicate enrollments/grants
- optionally send one combined notification email, not one email per course/product

---

## PHASE 5 — Source Tracking in Client Hub

In the Client Hub, Roberta must be able to see and filter by where the person came from.

Add/verify:
- Source/List column
- import_sources display in Person Detail Panel
- filter by source/list
- sort by source/list

If a person came from multiple CSVs, show all sources as tags.

**Acceptance:** Roberta can filter to "LENS Students" or "CRM Conscious Nap" and see only that list.

---

## PHASE 6 — Custom Welcome / Setup Email

Roberta wants a specific email sent when these imported users are invited to create their login.

This should be the branded pre-invite/setup email that goes before the system password/setup invite.

### Subject
Your Mind Stylist / Pocket Mindset access from Roberta Fernandez

### Email Body

> I promise that you know me!
>
> You've either been a client of FARE Hypnosis, used Conscious Napping®, been a student, or have some other connection to me.
>
> I am rebranding to better reflect the evolution of FARE Hypnosis and Conscious Napping®.
>
> The new name is Your Mind Stylist and the app is now Pocket Mindset.
>
> Over the past 15 years, you may have received only one or two emails from me. This will not change, as I now have a non-intrusive way for you to continue our work or to reengage with me:
>
> Your new personalized dashboard has been set up and is waiting for you!
>
> It is fun, has freebies to be added regularly, and offers other ways to engage with my services and content.
>
> All you have to do is click the link in this email and set up a password. Then have fun continuing to restyle your life.
>
> As always, feel free to reach out any time,
>
> Roberta Fernandez  
> Your Mind Stylist

### Requirements
- Use Roberta / Your Mind Stylist branding
- Include logo if available
- Send this branded email BEFORE the platform setup invite
- Do not send duplicate emails to duplicate contacts
- Track invite_sent_at and invite_status
- Log email delivery in EmailSendLog

---

## PHASE 7 — Safety + Dry Run

Before sending any emails:

1. Run import dry-run only.
2. Return:
   - total rows
   - unique emails
   - duplicates merged
   - records that would be created
   - records that would be updated
   - missing emails
   - unmapped what_they_bought values
   - source/list counts

3. **Do not send invites until explicitly approved.**

After approval:
- import records
- then separately ask for approval before sending welcome/setup emails

---

## PHASE 8 — QA

After import:

### Verify
- Imported contacts appear in Client Hub customer/user view
- All CSV fields are visible in Person Detail Panel
- Source/list filters work
- Duplicate emails are merged
- Courses/products are not assigned until mapping is approved
- Welcome email template is editable by Roberta
- Invite status updates correctly
- Pending users disappear from pending once they create account

### Return
- import summary
- mapping summary
- unresolved records
- any records requiring manual review

---

## Important Constraints

- Do not delete existing users/leads.
- Do not overwrite existing valid data.
- Do not send emails during audit/dry run.
- Do not enroll users in sensitive training content without explicit mapping approval.

---

## CSV File URLs (for processing)

| File | URL |
|------|-----|
| Acuity list | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/305b10461_Acuitylist.csv |
| CRM Conscious Nap | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/ba0baaaed_CRMConsciousNap.csv |
| CRM Contact:Colleagues | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/b943b01ad_CRMContactColleagues.csv |
| Linda Clients | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/def5a1464_LindaClients.csv |
| Roberta-Updated 3/2026 | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/54a61e0f0_Roberta-Updated32026.csv |
| LENS Students | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/176acb139_LENSStudents.csv |
| Hypnosis Students | https://media.base44.com/files/public/693a98b3e154ab3b36c88ebb/09f5f051a_HypnosisStudents.csv |