import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LeadImport({ open, onOpenChange, onSuccess }) {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

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
            let value = values[i]?.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"') || '';
            
            // Map common Kajabi field names to our schema
            const fieldMap = {
              'name': 'full_name',
              'Name': 'full_name',
              'email': 'email',
              'Email': 'email',
              'phone': 'phone',
              'Phone': 'phone',
              'tags': 'tags',
              'Tags': 'tags',
              'notes': 'notes',
              'Notes': 'notes',
            };
            
            const mappedField = fieldMap[header] || header.toLowerCase();
            obj[mappedField] = value;
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
            errors.push(`Skipped row without email`);
            continue;
          }

          // Check if lead exists
          const existing = await base44.entities.Lead.filter({ email: item.email });
          
          const leadData = {
            email: item.email,
            full_name: item.full_name || item.name || '',
            phone: item.phone || '',
            source: item.source || 'import',
            stage: item.stage || 'new',
            interest_level: item.interest_level || 'cold',
            tags: typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()) : (item.tags || []),
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

      setImportResults({ created, updated, errors });
      
      if (errors.length === 0) {
        toast.success(`Successfully imported ${created} new leads, updated ${updated}`);
        onSuccess?.();
      } else {
        toast.error(`Imported with ${errors.length} errors. Check details.`);
      }
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
      setImportResults({ created: 0, updated: 0, errors: [error.message] });
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'email,full_name,phone,source,tags,notes',
      'john@example.com,John Doe,555-0123,kajabi,"coaching,interested",Previous client from Kajabi',
      'jane@example.com,Jane Smith,555-0456,kajabi,"certification",Completed course in 2024'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lead-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Import Leads</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions */}
          <div className="bg-[#F9F5EF] p-4 rounded-lg">
            <h3 className="font-medium text-[#1E3A32] mb-2">Import Instructions</h3>
            <ul className="text-sm text-[#2B2725]/70 space-y-1 list-disc list-inside">
              <li>Supports CSV and JSON formats</li>
              <li>Email field is required for all leads</li>
              <li>Existing leads (same email) will be updated</li>
              <li>New leads will be created with default settings</li>
            </ul>
          </div>

          {/* Template Download */}
          <div>
            <Label className="mb-2 block">Need a template?</Label>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full border-[#D8B46B] hover:bg-[#D8B46B]/10"
            >
              <Download size={16} className="mr-2" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <Label className="mb-2 block">Upload File</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="w-full bg-[#1E3A32] hover:bg-[#2B2725]"
            >
              <Upload size={16} className={`mr-2 ${importing ? 'animate-pulse' : ''}`} />
              {importing ? 'Importing...' : 'Choose File to Import'}
            </Button>
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={20} />
                <span className="font-medium">
                  {importResults.created} new leads created, {importResults.updated} leads updated
                </span>
              </div>
              
              {importResults.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2 text-red-700 mb-2">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{importResults.errors.length} errors occurred:</p>
                      <ul className="text-sm mt-2 space-y-1">
                        {importResults.errors.slice(0, 5).map((error, idx) => (
                          <li key={idx} className="truncate">{error}</li>
                        ))}
                        {importResults.errors.length > 5 && (
                          <li className="text-xs italic">...and {importResults.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Field Mapping Reference */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-[#1E3A32] mb-2">Supported Fields</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#2B2725]/70">
              <div>• email (required)</div>
              <div>• full_name or name</div>
              <div>• phone</div>
              <div>• source</div>
              <div>• stage</div>
              <div>• interest_level</div>
              <div>• tags (comma-separated)</div>
              <div>• notes</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}