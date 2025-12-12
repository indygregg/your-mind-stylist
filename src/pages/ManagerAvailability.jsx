import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Calendar, Clock, Save, Plus, Trash2 } from "lucide-react";

export default function ManagerAvailability() {
  // Set auth layout
  if (typeof window !== 'undefined') {
    window.__USE_AUTH_LAYOUT = true;
  }

  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
  ];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
  };

  // Fetch availability rules
  const { data: rules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ['availability-rules', user?.id],
    queryFn: () => base44.entities.AvailabilityRule.filter({ manager_id: user.id }),
    enabled: !!user,
  });

  // Fetch availability settings
  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ['availability-settings', user?.id],
    queryFn: () => base44.entities.AvailabilitySettings.filter({ manager_id: user.id }),
    enabled: !!user,
  });

  const currentSettings = settings[0] || {
    buffer_minutes: 15,
    min_notice_hours: 24,
    max_advance_days: 90,
    timezone: "America/Los_Angeles"
  };

  // Mutations
  const createRuleMutation = useMutation({
    mutationFn: (ruleData) => base44.entities.AvailabilityRule.create(ruleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules'] });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AvailabilityRule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules'] });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id) => base44.entities.AvailabilityRule.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules'] });
    },
  });

  const saveSettingsMutation = useMutation({
    mutationFn: (settingsData) => {
      if (settings[0]?.id) {
        return base44.entities.AvailabilitySettings.update(settings[0].id, settingsData);
      } else {
        return base44.entities.AvailabilitySettings.create({ ...settingsData, manager_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-settings'] });
    },
  });

  // Local state for editing
  const [editingSettings, setEditingSettings] = useState(currentSettings);

  useEffect(() => {
    setEditingSettings(currentSettings);
  }, [settings]);

  const handleAddTimeSlot = (dayOfWeek) => {
    createRuleMutation.mutate({
      manager_id: user.id,
      day_of_week: dayOfWeek,
      start_time: "09:00",
      end_time: "17:00",
      active: true
    });
  };

  const handleUpdateTimeSlot = (id, field, value) => {
    const rule = rules.find(r => r.id === id);
    updateRuleMutation.mutate({
      id,
      data: { ...rule, [field]: value }
    });
  };

  const handleDeleteTimeSlot = (id) => {
    deleteRuleMutation.mutate(id);
  };

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(editingSettings);
  };

  if (!user || rulesLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-[#2B2725]/70">Loading availability settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-[#D8B46B]" />
            <h1 className="font-serif text-4xl text-[#1E3A32]">Availability Management</h1>
          </div>
          <p className="text-[#2B2725]/70 text-lg">
            Set your weekly schedule and booking rules
          </p>
        </motion.div>

        {/* Global Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Booking Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Buffer Between Appointments (minutes)</Label>
                <Input
                  type="number"
                  value={editingSettings.buffer_minutes}
                  onChange={(e) => setEditingSettings({ ...editingSettings, buffer_minutes: parseInt(e.target.value) })}
                  className="mt-2"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">Time buffer added between back-to-back appointments</p>
              </div>

              <div>
                <Label>Minimum Notice Required (hours)</Label>
                <Input
                  type="number"
                  value={editingSettings.min_notice_hours}
                  onChange={(e) => setEditingSettings({ ...editingSettings, min_notice_hours: parseInt(e.target.value) })}
                  className="mt-2"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">Clients must book this many hours in advance</p>
              </div>

              <div>
                <Label>Maximum Advance Booking (days)</Label>
                <Input
                  type="number"
                  value={editingSettings.max_advance_days}
                  onChange={(e) => setEditingSettings({ ...editingSettings, max_advance_days: parseInt(e.target.value) })}
                  className="mt-2"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">How far ahead clients can book</p>
              </div>

              <div>
                <Label>Timezone</Label>
                <Input
                  value={editingSettings.timezone}
                  onChange={(e) => setEditingSettings({ ...editingSettings, timezone: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">Your local timezone</p>
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="mt-6">
              <Save size={16} className="mr-2" />
              Save Booking Rules
            </Button>
          </Card>
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Weekly Schedule</h2>
            <div className="space-y-6">
              {daysOfWeek.map((day) => {
                const dayRules = rules.filter(r => r.day_of_week === day.value);
                
                return (
                  <div key={day.value} className="border-b border-[#E4D9C4] pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-[#1E3A32]">{day.label}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddTimeSlot(day.value)}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Time Slot
                      </Button>
                    </div>

                    {dayRules.length === 0 ? (
                      <p className="text-sm text-[#2B2725]/50 italic">Not available</p>
                    ) : (
                      <div className="space-y-3">
                        {dayRules.map((rule) => (
                          <div key={rule.id} className="flex items-center gap-4 bg-[#F9F5EF] p-4 rounded">
                            <div className="flex items-center gap-2 flex-1">
                              <Clock size={16} className="text-[#D8B46B]" />
                              <Input
                                type="time"
                                value={rule.start_time}
                                onChange={(e) => handleUpdateTimeSlot(rule.id, 'start_time', e.target.value)}
                                className="w-32"
                              />
                              <span className="text-[#2B2725]/60">to</span>
                              <Input
                                type="time"
                                value={rule.end_time}
                                onChange={(e) => handleUpdateTimeSlot(rule.id, 'end_time', e.target.value)}
                                className="w-32"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.active}
                                onCheckedChange={(checked) => handleUpdateTimeSlot(rule.id, 'active', checked)}
                              />
                              <span className="text-sm text-[#2B2725]/70">Active</span>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTimeSlot(rule.id)}
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}