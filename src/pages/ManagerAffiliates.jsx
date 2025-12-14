import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle, Search, Clock } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ManagerAffiliates() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch all affiliates
  const { data: affiliates = [], isLoading } = useQuery({
    queryKey: ["affiliates"],
    queryFn: () => base44.entities.Affiliate.list("-created_date"),
  });

  // Fetch all referrals
  const { data: allReferrals = [] } = useQuery({
    queryKey: ["allReferrals"],
    queryFn: () => base44.entities.AffiliateReferral.list("-created_date", 100),
  });

  // Approve affiliate
  const approveMutation = useMutation({
    mutationFn: async (affiliateId) => {
      return base44.asServiceRole.entities.Affiliate.update(affiliateId, {
        status: "active",
        approved_date: new Date().toISOString(),
        approved_by: (await base44.auth.me()).email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
      toast.success("Affiliate approved!");
    },
  });

  // Update affiliate
  const updateMutation = useMutation({
    mutationFn: ({ affiliateId, updates }) => {
      return base44.asServiceRole.entities.Affiliate.update(affiliateId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
      setEditDialogOpen(false);
      toast.success("Affiliate updated!");
    },
  });

  // Approve commission
  const approveCommissionMutation = useMutation({
    mutationFn: async (referralId) => {
      return base44.asServiceRole.entities.AffiliateReferral.update(referralId, {
        commission_status: "approved",
        commission_approved_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReferrals"] });
      toast.success("Commission approved!");
    },
  });

  // Filter affiliates
  const filteredAffiliates = affiliates.filter((aff) => {
    const query = searchQuery.toLowerCase();
    const user = aff.user_id; // Would need to fetch user details
    return (
      aff.affiliate_code?.toLowerCase().includes(query) ||
      aff.payment_email?.toLowerCase().includes(query)
    );
  });

  // Calculate stats
  const pendingAffiliates = affiliates.filter((a) => a.status === "pending").length;
  const activeAffiliates = affiliates.filter((a) => a.status === "active").length;
  const totalCommissionPending = affiliates.reduce((sum, a) => sum + (a.commission_pending || 0), 0);
  const totalRevenue = affiliates.reduce((sum, a) => sum + (a.total_revenue_generated || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Affiliate Management</h1>
          <p className="text-[#2B2725]/70">Manage affiliates, commissions, and payouts</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Total Affiliates</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{affiliates.length}</p>
                </div>
                <Users size={32} className="text-[#D8B46B]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Pending Approval</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{pendingAffiliates}</p>
                </div>
                <Clock size={32} className="text-[#A6B7A3]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Commission Due</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">
                    ${(totalCommissionPending / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign size={32} className="text-[#6E4F7D]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">
                    ${(totalRevenue / 100).toFixed(2)}
                  </p>
                </div>
                <TrendingUp size={32} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="affiliates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Affiliates ({filteredAffiliates.length})</span>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={16} />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8 text-[#2B2725]/60">Loading...</p>
                ) : filteredAffiliates.length === 0 ? (
                  <p className="text-center py-8 text-[#2B2725]/60">No affiliates found</p>
                ) : (
                  <div className="space-y-3">
                    {filteredAffiliates.map((affiliate) => (
                      <motion.div
                        key={affiliate.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border border-[#E4D9C4] rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-[#1E3A32]">
                                {affiliate.payment_email || "No email"}
                              </h3>
                              <Badge
                                variant={affiliate.status === "active" ? "default" : "secondary"}
                                className={
                                  affiliate.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : affiliate.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-600"
                                }
                              >
                                {affiliate.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-mono text-[#2B2725]/60">
                              Code: {affiliate.affiliate_code}
                            </p>
                            <p className="text-xs text-[#2B2725]/40 mt-1">
                              {affiliate.commission_rate}% commission • {affiliate.commission_tier} tier
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#2B2725]/60">
                              {affiliate.successful_conversions} / {affiliate.total_referrals} conversions
                            </p>
                            <p className="text-lg font-bold text-[#1E3A32]">
                              ${(affiliate.commission_pending / 100).toFixed(2)} pending
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {affiliate.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(affiliate.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                          )}
                          <Dialog
                            open={editDialogOpen && selectedAffiliate?.id === affiliate.id}
                            onOpenChange={(open) => {
                              setEditDialogOpen(open);
                              if (open) setSelectedAffiliate(affiliate);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Affiliate</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Commission Rate (%)</label>
                                  <Input
                                    type="number"
                                    defaultValue={affiliate.commission_rate}
                                    onChange={(e) =>
                                      setSelectedAffiliate({
                                        ...selectedAffiliate,
                                        commission_rate: parseFloat(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Tier</label>
                                  <Select
                                    defaultValue={affiliate.commission_tier}
                                    onValueChange={(value) =>
                                      setSelectedAffiliate({
                                        ...selectedAffiliate,
                                        commission_tier: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="standard">Standard</SelectItem>
                                      <SelectItem value="silver">Silver</SelectItem>
                                      <SelectItem value="gold">Gold</SelectItem>
                                      <SelectItem value="platinum">Platinum</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select
                                    defaultValue={affiliate.status}
                                    onValueChange={(value) =>
                                      setSelectedAffiliate({ ...selectedAffiliate, status: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="suspended">Suspended</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  onClick={() =>
                                    updateMutation.mutate({
                                      affiliateId: affiliate.id,
                                      updates: {
                                        commission_rate: selectedAffiliate.commission_rate,
                                        commission_tier: selectedAffiliate.commission_tier,
                                        status: selectedAffiliate.status,
                                      },
                                    })
                                  }
                                  className="w-full"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                {allReferrals.length === 0 ? (
                  <p className="text-center py-8 text-[#2B2725]/60">No referrals yet</p>
                ) : (
                  <div className="space-y-3">
                    {allReferrals.slice(0, 20).map((ref) => (
                      <div
                        key={ref.id}
                        className="flex justify-between items-center p-4 border border-[#E4D9C4] rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-[#1E3A32]">
                            {ref.referred_user_email || "Anonymous"}
                          </p>
                          <p className="text-sm text-[#2B2725]/60">
                            Code: {ref.affiliate_code} • {ref.product_name || "No purchase"}
                          </p>
                          <p className="text-xs text-[#2B2725]/40">
                            {new Date(ref.created_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <Badge
                              variant={ref.status === "converted" ? "default" : "secondary"}
                              className={
                                ref.status === "converted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {ref.status}
                            </Badge>
                            {ref.commission_amount > 0 && (
                              <p className="text-sm font-medium text-[#1E3A32] mt-1">
                                ${(ref.commission_amount / 100).toFixed(2)}
                              </p>
                            )}
                          </div>
                          {ref.commission_status === "pending" && ref.status === "converted" && (
                            <Button
                              size="sm"
                              onClick={() => approveCommissionMutation.mutate(ref.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payouts (Coming Soon)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-[#2B2725]/60">
                  Payout processing integration coming soon. Currently managing manually.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}