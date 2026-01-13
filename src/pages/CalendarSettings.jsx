import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle, RefreshCw, Copy, Check, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function CalendarSettings() {
  const [user, setUser] = useState(null);
  const [iCalUrl, setICalUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Generate iCal feed URL
        const feedUrl = `${window.location.origin}/api/ical-feed?user_id=${currentUser.id}`;
        setICalUrl(feedUrl);

        // Check for success/error query params
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
          toast.success('Google Calendar connected successfully!');
          // Clear the query param
          window.history.replaceState({}, '', window.location.pathname);
        } else if (urlParams.get('error')) {
          const errorMsg = urlParams.get('error');
          const details = urlParams.get('details') || urlParams.get('message');
          toast.error(`Failed to connect: ${errorMsg}${details ? ' - ' + details : ''}`);
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load calendar settings");
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

  const handleSyncFromCalendar = async () => {
    setSyncing(true);
    try {
      const response = await base44.functions.invoke('syncCalendarToAvailability');
      toast.success(response.data.message || 'Calendar synced successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to sync calendar');
    } finally {
      setSyncing(false);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to={createPageUrl("ManagerDashboard")}
            className="inline-flex items-center gap-2 text-[#1E3A32]/70 hover:text-[#1E3A32] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Manager Dashboard
          </Link>
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

        {/* Two-Way Sync - NEW */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ArrowLeftRight className="text-[#6E4F7D]" />
              Two-Way Calendar Sync with Google Calendar
            </CardTitle>
            <CardDescription>
              Block booking times based on events in your personal calendar (Google Calendar, Apple Calendar via Google sync)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1: Authorize Google Calendar */}
              <div className="bg-gradient-to-r from-[#6E4F7D]/10 to-[#6E4F7D]/5 border-2 border-[#6E4F7D] p-6 rounded-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#6E4F7D] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#1E3A32] mb-2">Connect Your Google Calendar</h4>
                    <p className="text-sm text-[#2B2725]/80 mb-4">
                      First, you need to authorize access to your Google Calendar. This allows the system to read your calendar events and block those times from being booked.
                    </p>
                    <Button
                      onClick={async () => {
                        setConnectingGoogle(true);
                        try {
                          const response = await base44.functions.invoke('googleCalendarAuth');
                          if (response.data?.authUrl) {
                            window.location.href = response.data.authUrl;
                          } else {
                            toast.error('No authorization URL received');
                            setConnectingGoogle(false);
                          }
                        } catch (error) {
                          toast.error('Failed to start authorization: ' + error.message);
                          setConnectingGoogle(false);
                        }
                      }}
                      disabled={connectingGoogle}
                      className="bg-[#6E4F7D] hover:bg-[#5A3F67]"
                    >
                      {connectingGoogle ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Calendar size={16} className="mr-2" />
                          Authorize Google Calendar
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-[#2B2725]/60 mt-2">
                      You'll be redirected to Google to grant calendar access
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#2B2725]/80">
                When you have appointments with other companies or personal events in your calendar, 
                sync them here to automatically block those times from being booked on your website.
              </p>

              <div className="bg-[#F9F5EF] p-4 rounded-lg">
                <h4 className="font-medium text-[#1E3A32] mb-2">Full Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-[#2B2725]/80">
                  <li><strong>Connect Google Calendar:</strong> Click "Authorize Google Calendar" above and log in with your Google account</li>
                  <li><strong>Sync Apple Calendar to Google:</strong> If you use Apple Calendar:
                    <ul className="ml-6 mt-1 list-disc space-y-1">
                      <li>On iPhone/iPad: Settings → Calendar → Accounts → Add Account → Google</li>
                      <li>On Mac: System Settings → Internet Accounts → Google → Enable Calendar</li>
                      <li>Your Apple Calendar events will now appear in Google Calendar</li>
                    </ul>
                  </li>
                  <li><strong>Click "Sync Now" below:</strong> Import all your calendar events to block booking times</li>
                  <li><strong>Run Sync Regularly:</strong> Click "Sync Now" whenever you add appointments with other companies</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>💡 Pro Tip:</strong> Add all your appointments (other companies, personal events, etc.) to your main calendar, 
                  then sync once. Your booking system will automatically block those times to prevent double-booking.
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleSyncFromCalendar}
                  disabled={syncing}
                  className="bg-[#6E4F7D] hover:bg-[#5A3F67]"
                >
                  {syncing ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight size={16} className="mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
                <p className="text-xs text-[#2B2725]/60">
                  Last synced: Never (requires Google Calendar connection)
                </p>
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
              <p><strong>Website → Your Calendar:</strong> Your calendar app checks the feed for updates every few hours</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                2
              </div>
              <p><strong>Your Calendar → Website:</strong> Click "Sync Now" to import events and block booking times</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                3
              </div>
              <p>Client details and Zoom links are included in each calendar event</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                4
              </div>
              <p>Blocked times from your personal calendar prevent double-booking</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}