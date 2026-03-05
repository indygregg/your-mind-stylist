import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function LeadImport({ open, onOpenChange, onSuccess }) {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      let importData = [];

      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        importData = lines.slice(1).map(line => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((header, i) => {
            let value = values[i]?.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
            obj[header] = value || '';
          });
          return obj;
        });
      }

      let created = 0;
      let updated = 0;
      let errors = [];

      for (const item of importData) {
        try {
          if (!item.email) {
            errors.push(`Skipped row: missing email`);
            continue;
          }

          const existing = await base44.entities.Lead.filter({ email: item.email });
          
          const leadData = {
            email: item.email,
            first_name: item.first_name || '',
            last_name: item.last_name || '',
            phone: item.phone || '',
            address_line1: item.address_line1 || '',
            city: item.city || '',
            state: item.state || '',
            zip: item.zip || '',
            source: item.source || 'other',
            stage: item.stage || 'new',
            what_inquired_about: item.what_inquired_about || '',
            what_they_bought: item.what_they_bought || '',
            date_of_purchase: item.date_of_purchase || '',
            follow_up_actions: item.follow_up_actions || '',
            notes: item.notes || '',
          };

          if (existing.length > 0) {
            await base44.entities.Lead.update(existing[0].id, leadData);
            updated++;
          } else {
            await base44.entities.Lead.create(leadData);
            created++;
          }
        } catch (error) {
          errors.push(`Failed to import ${item.email}: ${error.message}`);
        }
      }

      setResults({ total: importData.length, created, updated, errors, success: errors.length === 0 });

      if (errors.length === 0) {
        toast.success(`Successfully imported ${created} new leads and updated ${updated} existing!`);
        setTimeout(() => onSuccess(), 2000);
      } else {
        toast.error(`Import completed with ${errors.length} errors.`);
      }
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
      setResults({ total: 0, created: 0, updated: 0, errors: [error.message], success: false });
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvTemplate = `email,first_name,last_name,phone,address_line1,city,state,zip,source,stage,what_inquired_about,what_they_bought,date_of_purchase,follow_up_actions,notes
john@example.com,John,Doe,+1234567890,123 Main St,Las Vegas,NV,89148,referral,new,Hypnosis Training,,,Follow up next week,Great referral from Sarah`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lead-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-[#1E3A32] mb-2">Step 1: Download Template</h3>
            <p className="text-sm text-[#2B2725]/70 mb-3">
              Get the CSV template with required fields
            </p>
            <Button size="sm" variant="outline" onClick={downloadTemplate}>
              <Download size={14} className="mr-2" />
              Download Template
            </Button>
          </div>

          <div>
            <h3 className="font-medium text-[#1E3A32] mb-2">Step 2: Required Fields</h3>
            <ul className="text-sm text-[#2B2725]/70 space-y-1 list-disc list-inside">
              <li><strong>email</strong> (required) - Lead's email</li>
              <li><strong>full_name</strong> - Full name</li>
              <li><strong>phone</strong> - Phone number</li>
              <li><strong>source</strong> - e.g., "kajabi", "website"</li>
              <li><strong>stage</strong> - new, contacted, qualified, etc.</li>
              <li><strong>interest_level</strong> - cold, warm, hot</li>
              <li><strong>lead_score</strong> - Number 0-100</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-[#1E3A32] mb-2">Step 3: Upload File</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="bg-[#1E3A32] hover:bg-[#2B2725]"
            >
              <Upload size={16} className={`mr-2 ${importing ? "animate-pulse" : ""}`} />
              {importing ? "Importing..." : "Upload CSV or JSON"}
            </Button>
          </div>

          {results && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-4">
                {results.success ? (
                  <>
                    <CheckCircle2 className="text-green-600" size={20} />
                    <h3 className="font-medium text-green-700">Import Successful!</h3>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-yellow-600" size={20} />
                    <h3 className="font-medium text-yellow-700">Import Completed with Issues</h3>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-[#F9F5EF] p-3 rounded">
                  <p className="text-xs text-[#2B2725]/60">Total</p>
                  <p className="text-xl font-bold">{results.total}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-[#2B2725]/60">New</p>
                  <p className="text-xl font-bold text-green-700">{results.created}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-[#2B2725]/60">Updated</p>
                  <p className="text-xl font-bold text-blue-700">{results.updated}</p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm font-medium text-red-800 mb-2">Errors:</p>
                  {results.errors.map((error, i) => (
                    <p key={i} className="text-xs text-red-700">• {error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}