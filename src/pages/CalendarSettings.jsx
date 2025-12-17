import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CalendarSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Check if calendar is connected by checking user data
        if (currentUser.calendar_connected) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleConnect = async () => {
    toast.error("Google Calendar integration requires OAuth setup. Please contact support to enable this feature.");
  };

  const handleDisconnect = async () => {
    try {
      await base44.auth.updateMe({ calendar_connected: false });
      setIsConnected(false);
      toast.success("Calendar disconnected");
    } catch (error) {
      toast.error("Failed to disconnect calendar");
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      // Get all confirmed bookings
      const bookings = await base44.entities.Booking.filter({
        booking_status: "confirmed",
      });

      let synced = 0;
      for (const booking of bookings) {
        if (!booking.google_calendar_event_id && booking.scheduled_date) {
          try {
            await base44.functions.invoke('syncBookingToCalendar', {
              booking_id: booking.id,
            });
            synced++;
          } catch (e) {
            console.error(`Failed to sync booking ${booking.id}:`, e);
          }
        }
      }

      toast.success(`Synced ${synced} bookings to calendar`);
    } catch (error) {
      toast.error("Failed to sync bookings");
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
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Calendar Sync</h1>
          <p className="text-[#2B2725]/70">
            Connect your Google Calendar to automatically sync bookings
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="text-[#D8B46B]" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription>
              Sync your bookings with Google Calendar for better scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-600 mb-4">
                  <CheckCircle size={20} />
                  <span className="font-medium">Calendar Connected</span>
                </div>
                <p className="text-sm text-[#2B2725]/70 mb-4">
                  Your bookings will automatically sync to your Google Calendar. You can also manually sync all existing bookings.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSyncAll}
                    disabled={syncing}
                    className="bg-[#1E3A32] hover:bg-[#2B2725]"
                  >
                    {syncing ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Sync All Bookings
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleDisconnect}>
                    Disconnect Calendar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#2B2725]/60 mb-4">
                  <AlertCircle size={20} />
                  <span>Calendar Not Connected</span>
                </div>
                <p className="text-sm text-[#2B2725]/70 mb-4">
                  Connect your Google Calendar to automatically create calendar events for your bookings. This helps you stay organized and reduces no-shows.
                </p>
                <Button onClick={handleConnect} className="bg-[#1E3A32] hover:bg-[#2B2725]">
                  <Calendar size={16} className="mr-2" />
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#2B2725]/80">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                1
              </div>
              <p>When a booking is confirmed, an event is automatically created in your Google Calendar</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                2
              </div>
              <p>If you reschedule a booking, the calendar event is automatically updated</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                3
              </div>
              <p>Cancelled bookings are removed from your calendar</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0 text-[#D8B46B] font-medium">
                4
              </div>
              <p>Client details and Zoom links are included in the event description</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}