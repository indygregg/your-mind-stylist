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
              Apple Calendar Sync
            </h1>
            <p className="text-[#2B2725]/70 text-lg">
              See your bookings in your personal calendar automatically
            </p>
          </div>

          {/* What You'll Get */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-[#FFF9F0] to-white border-[#D8B46B]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-[#D8B46B]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#1E3A32] mb-2">
                  What You'll Get
                </h2>
                <p className="text-[#2B2725]/70">
                  Your confirmed bookings will appear in Apple Calendar, Google Calendar, Outlook, or any calendar app that supports iCal feeds.
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                'Automatic sync - new bookings appear instantly',
                'Client name, email, and session details',
                'Zoom meeting links directly in the calendar event',
                'Updates when bookings are cancelled or rescheduled',
                'Works on all your devices (iPhone, iPad, Mac)',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#2B2725]">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Setup Instructions */}
          <Card className="p-8 mb-8">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
              How to Set Up
            </h2>

            {/* Step 1: Copy URL */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h3 className="font-medium text-[#1E3A32] text-lg">Copy Your Calendar Feed URL</h3>
              </div>
              
              <div className="bg-[#F9F5EF] p-4 rounded-lg border border-[#E4D9C4]">
                <p className="text-xs text-[#2B2725]/60 mb-2">Your private calendar feed:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded text-sm font-mono text-[#1E3A32] break-all">
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
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h3 className="font-medium text-[#1E3A32] text-lg">Add to Your Calendar App</h3>
              </div>

              {/* Apple Calendar Instructions */}
              <div className="bg-[#F9F5EF] p-6 rounded-lg mb-4">
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
              <div className="bg-[#F9F5EF] p-6 rounded-lg mb-4">
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
              <div className="bg-[#F9F5EF] p-6 rounded-lg">
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

            {/* Step 3: Done */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={18} />
                </div>
                <h3 className="font-medium text-[#1E3A32] text-lg">You're All Set!</h3>
              </div>
              <p className="text-[#2B2725]/70 ml-11">
                Your bookings will now appear in your calendar automatically. The feed updates every 15 minutes, so new bookings will show up quickly.
              </p>
            </div>
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