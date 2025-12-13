import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Lock, Settings, Upload, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: user?.email_notifications ?? true,
    booking_reminders: user?.booking_reminders ?? true,
    marketing_emails: user?.marketing_emails ?? false,
    weekly_digest: user?.weekly_digest ?? true,
  });

  React.useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
      setNotificationPrefs({
        email_notifications: user.email_notifications ?? true,
        booking_reminders: user.booking_reminders ?? true,
        marketing_emails: user.marketing_emails ?? false,
        weekly_digest: user.weekly_digest ?? true,
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleNotificationUpdate = (key, value) => {
    const newPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(newPrefs);
    updateProfileMutation.mutate(newPrefs);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const result = await base44.functions.invoke("uploadProfilePhoto", { file });
      if (result.data.url) {
        await base44.auth.updateMe({ profile_photo: result.data.url });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Profile photo updated");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-[#1E3A32] mb-8">Profile & Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#D8B46B]/20 flex items-center justify-center overflow-hidden">
                    {user?.profile_photo ? (
                      <img
                        src={user.profile_photo}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-[#D8B46B]" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white transition-colors rounded">
                        <Upload size={16} />
                        {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                      </div>
                    </Label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <p className="text-xs text-[#2B2725]/60 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, full_name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-[#2B2725]/60 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1E3A32]">Email Notifications</p>
                      <p className="text-sm text-[#2B2725]/60">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_notifications}
                      onCheckedChange={(v) => handleNotificationUpdate("email_notifications", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1E3A32]">Booking Reminders</p>
                      <p className="text-sm text-[#2B2725]/60">
                        Get reminders before your scheduled sessions
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.booking_reminders}
                      onCheckedChange={(v) => handleNotificationUpdate("booking_reminders", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1E3A32]">Marketing Emails</p>
                      <p className="text-sm text-[#2B2725]/60">
                        Receive updates about new programs and features
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.marketing_emails}
                      onCheckedChange={(v) => handleNotificationUpdate("marketing_emails", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1E3A32]">Weekly Digest</p>
                      <p className="text-sm text-[#2B2725]/60">
                        Get a weekly summary of your progress
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.weekly_digest}
                      onCheckedChange={(v) => handleNotificationUpdate("weekly_digest", v)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  Dashboard Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#2B2725]/70">
                  {user?.role === "admin" || user?.role === "manager"
                    ? "Additional dashboard preferences for managers coming soon."
                    : "Customize your dashboard experience (coming soon)."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}