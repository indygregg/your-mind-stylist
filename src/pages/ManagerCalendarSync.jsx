import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Copy, CheckCircle, ExternalLink, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerCalendarSync() {
  const [copied, setCopied] = useState(false);
  
  // Generate the iCal feed URL (this will be a read-only feed that Apple Calendar can subscribe to)
  const feedUrl = `${window.location.origin}/api/functions/generateICalFeed`;

  const handleCopy = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(feedUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-3">
              Calendar Sync Status
            </h1>
            <p className="text-[#2B2725]/70 text-lg">
              Your bookings automatically sync to Google Calendar in real-time
            </p>
          </div>

          {/* What You'll Get */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#1E3A32] mb-2">
                  ✅ Already Set Up!
                </h2>
                <p className="text-[#2B2725]/70">
                  All bookings now automatically sync to your Google Calendar. If your iCal is connected to Google Calendar, you'll see them there too within minutes!
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-[#2B2725] mb-3">
                <strong>How it works:</strong>
              </p>
              <ul className="space-y-2">
                {[
                  'Bookings created on your website automatically push to Google Calendar',
                  'Updates happen in real-time (no waiting for feed refreshes)',
                  'Includes client name, email, session details, and Zoom links',
                  'Cancellations and reschedules update automatically',
                  'Your iCal/Apple Calendar syncs with Google Calendar and displays them',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#2B2725]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Optional iCal Feed (Legacy) */}
          <Card className="p-8 mb-8 border-[#2B2725]/20">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-[#1E3A32] mb-2 flex items-center gap-2">
                <span className="text-xl">ℹ️</span>
                You Don't Need This Anymore!
              </h3>
              <p className="text-sm text-[#2B2725]/80">
                Bookings now automatically sync to Google Calendar in real-time. If you use Apple Calendar or another calendar app, 
                just connect it to your Google Calendar instead of using this manual feed. You'll get instant updates instead of waiting 15+ minutes.
              </p>
            </div>

            <details className="bg-[#F9F5EF] p-6 rounded-lg">
              <summary className="font-medium text-[#1E3A32] cursor-pointer mb-4">
                Show manual iCal feed setup (if needed for other calendar apps)
              </summary>

              {/* Step 1: Copy URL */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <h3 className="font-medium text-[#1E3A32] text-lg">Copy Your Calendar Feed URL</h3>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-[#E4D9C4]">
                  <p className="text-xs text-[#2B2725]/60 mb-2">Your private calendar feed:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-[#F9F5EF] px-3 py-2 rounded text-sm font-mono text-[#1E3A32] break-all">
                      {feedUrl}
                    </code>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 2: Add to Calendar App */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <h3 className="font-medium text-[#1E3A32] text-lg">Add to Your Calendar App</h3>
                </div>

                {/* Apple Calendar Instructions */}
                <div className="bg-white p-6 rounded-lg mb-4 border border-[#E4D9C4]">
                  <h4 className="font-medium text-[#1E3A32] mb-3 flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    Apple Calendar (iPhone, iPad, Mac)
                  </h4>
                  <ol className="space-y-2 text-sm text-[#2B2725]/80">
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">1.</span>
                      <span>Open the <strong>Calendar</strong> app</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">2.</span>
                      <span>Go to <strong>File → New Calendar Subscription</strong> (Mac) or tap <strong>Calendars → Add Calendar → Add Subscription Calendar</strong> (iOS)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">3.</span>
                      <span>Paste the URL you copied above</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">4.</span>
                      <span>Name it "Mind Stylist Bookings" and choose a color</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">5.</span>
                      <span>Set refresh frequency to <strong>Every 15 minutes</strong> for best results</span>
                    </li>
                  </ol>
                </div>

                {/* Google Calendar Instructions */}
                <div className="bg-white p-6 rounded-lg mb-4 border border-[#E4D9C4]">
                  <h4 className="font-medium text-[#1E3A32] mb-3 flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    Google Calendar
                  </h4>
                  <ol className="space-y-2 text-sm text-[#2B2725]/80">
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">1.</span>
                      <span>Open <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-[#2D8CFF] hover:underline">Google Calendar</a></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">2.</span>
                      <span>Click the <strong>+</strong> button next to "Other calendars"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">3.</span>
                      <span>Select <strong>"From URL"</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">4.</span>
                      <span>Paste the URL and click <strong>Add calendar</strong></span>
                    </li>
                  </ol>
                </div>

                {/* Outlook Instructions */}
                <div className="bg-white p-6 rounded-lg border border-[#E4D9C4]">
                  <h4 className="font-medium text-[#1E3A32] mb-3 flex items-center gap-2">
                    <span className="text-2xl">📮</span>
                    Microsoft Outlook
                  </h4>
                  <ol className="space-y-2 text-sm text-[#2B2725]/80">
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">1.</span>
                      <span>Open Outlook and go to <strong>Calendar</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">2.</span>
                      <span>Click <strong>Add Calendar → Subscribe from web</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">3.</span>
                      <span>Paste the URL and name the calendar</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D8B46B] font-bold">4.</span>
                      <span>Click <strong>Import</strong></span>
                    </li>
                  </ol>
                </div>
              </div>
            </details>
          </Card>

          {/* Alternative: Download */}
          <Card className="p-6 bg-[#FFF9F0] border-[#D8B46B]/30">
            <h3 className="font-medium text-[#1E3A32] mb-3">
              Or Download as a File
            </h3>
            <p className="text-sm text-[#2B2725]/70 mb-4">
              If you prefer, you can download a one-time snapshot of your bookings as an .ics file and import it manually. Note: This won't auto-update like the subscription feed.
            </p>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              Download Calendar File (.ics)
            </Button>
          </Card>

          {/* Help */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-[#1E3A32] mb-2 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Need Help?
            </h3>
            <p className="text-sm text-[#2B2725]/80">
              If you have trouble setting up your calendar sync, check your calendar app's help documentation or reach out to support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}