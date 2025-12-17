import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CalendarSettings() {
  const [user, setUser] = useState(null);
  const [iCalUrl, setICalUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Generate iCal feed URL
        const feedUrl = `${window.location.origin}/api/ical-feed?user_id=${currentUser.id}`;
        setICalUrl(feedUrl);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(iCalUrl);
    setCopied(true);
    toast.success("Calendar feed URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Calendar Sync</h1>
          <p className="text-[#2B2725]/70">
            Subscribe to your bookings calendar in Apple Calendar, Outlook, or any calendar app
          </p>
        </div>

        {/* iCal Feed - PRIMARY OPTION */}
        <Card className="mb-6 border-2 border-[#D8B46B]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="text-[#D8B46B]" />
              iCal Calendar Feed
            </CardTitle>
            <CardDescription>
              Works with Apple Calendar, Google Calendar, Outlook, and any calendar app that supports iCal feeds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600 mb-4">
                <CheckCircle size={20} />
                <span className="font-medium">Your personal calendar feed is ready</span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#2B2725] mb-2 block">
                  Your Calendar Feed URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={iCalUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="mr-2" />
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
                <p className="text-xs text-[#2B2725]/60 mt-2">
                  This is your private calendar feed URL. Don't share it publicly.
                </p>
              </div>

              <div className="bg-[#F9F5EF] p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-[#1E3A32] mb-2">How to subscribe:</h4>
                
                <div className="space-y-3 text-sm text-[#2B2725]/80">
                  <div>
                    <p className="font-medium text-[#1E3A32] mb-1">📱 Apple Calendar (iPhone/Mac):</p>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Open Calendar app</li>
                      <li>Go to File → New Calendar Subscription (Mac) or Settings → Accounts → Add Account → Other → Add Subscribed Calendar (iPhone)</li>
                      <li>Paste your feed URL and click Subscribe</li>
                    </ol>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#1E3A32] mb-1">🌐 Google Calendar:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Open Google Calendar on web</li>
                      <li>Click the + next to "Other calendars"</li>
                      <li>Select "From URL"</li>
                      <li>Paste your feed URL and click Add Calendar</li>
                    </ol>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#1E3A32] mb-1">📧 Outlook:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Open Outlook Calendar</li>
                      <li>Go to Add Calendar → Subscribe from web</li>
                      <li>Paste your feed URL and click Import</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#2B2725]/80">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                1
              </div>
              <p>Your calendar app automatically checks your feed for updates every few hours</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                2
              </div>
              <p>New bookings, reschedules, and cancellations sync automatically</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                3
              </div>
              <p>Client details and Zoom links are included in each event</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                4
              </div>
              <p>Your feed URL stays the same, so you only need to subscribe once</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}