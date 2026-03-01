import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Users, Clock, Settings, Zap, Package, TrendingUp, AlertCircle, FileText, Calendar, ShoppingCart, CreditCard } from "lucide-react";

const operationsGroups = [
  {
    title: "Client Management",
    items: [
      { icon: Users, label: "CRM & Tags", link: "ManagerCRM" },
      { icon: FileText, label: "Consultation Forms", link: "ConsultationFormEditor" },
      { icon: FileText, label: "Intake Review", link: "ManagerIntakeReview" },
    ]
  },
  {
    title: "Booking System",
    items: [
      { icon: Clock, label: "Appointment Types", link: "ManagerAppointmentTypes" },
      { icon: Calendar, label: "Availability", link: "ManagerAvailability" },
      { icon: Calendar, label: "Booking Calendar", link: "ManagerCalendar" },
    ]
  },
  {
    title: "Products & Offers",
    items: [
      { icon: Package, label: "Product Manager", link: "ManagerProducts" },
      { icon: ShoppingCart, label: "Funnels", link: "ManagerMasterclass" },
      { icon: TrendingUp, label: "Payment Plans", link: "ManagerPaymentPlans" },
      { icon: CreditCard, label: "Subscriptions & Refunds", link: "ManagerSubscriptions" },
    ]
  },
  {
   title: "Integrations",
   items: [
     { icon: Zap, label: "Integration Setup", link: "IntegrationSetup" },
   ]
  },
  {
    title: "Advanced",
    items: [
      { icon: AlertCircle, label: "Bug Tracker", link: "AdminRoadmap" },
      { icon: Settings, label: "Settings", link: "ManagerSettings" },
    ]
  },
];

export default function ManagerDashboardOperations() {
  return (
    <div className="p-6 bg-white border-t border-[#E4D9C4] space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {operationsGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs text-[#1E3A32] uppercase tracking-wider font-medium opacity-60">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={createPageUrl(item.link)}
                  className="flex items-center gap-2 p-2 text-[#1E3A32] hover:bg-[#F9F5EF] rounded transition-colors group"
                >
                  <item.icon size={16} className="text-[#2B2725]/40 group-hover:text-[#1E3A32] transition-colors" />
                  <span className="text-sm group-hover:text-[#1E3A32]/80 transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}