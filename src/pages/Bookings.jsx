import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, CheckCircle, ArrowRight } from "lucide-react";
import { createPageUrl } from "../utils";
import SEO from "../components/SEO";

export default function Bookings() {
  const { data: appointmentTypes = [], isLoading } = useQuery({
    queryKey: ["appointmentTypes"],
    queryFn: () => base44.entities.AppointmentType.filter({ active: true }),
  });

  const formatPrice = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const serviceCategories = {
    private_sessions: {
      title: "Private Coaching",
      description: "One-on-one intensive sessions tailored to your specific needs",
      color: "#1E3A32"
    },
    consultation: {
      title: "Consultations",
      description: "Discovery calls and strategic planning sessions",
      color: "#6E4F7D"
    },
    certification: {
      title: "Training & Certification",
      description: "Professional development and certification programs",
      color: "#D8B46B"
    }
  };

  const groupedServices = appointmentTypes.reduce((acc, service) => {
    if (!acc[service.service_type]) {
      acc[service.service_type] = [];
    }
    acc[service.service_type].push(service);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A32] mx-auto mb-4"></div>
          <p className="text-[#2B2725]/70">Loading available services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Book Your Session - Your Mind Stylist"
        description="Schedule your personalized coaching session with Roberta Fernandez. Private sessions, consultations, and training programs available."
      />
      
      <div className="min-h-screen bg-[#F9F5EF]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-[#1E3A32] to-[#2B4A40] text-white">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#D8B46B] text-sm tracking-[0.3em] uppercase mb-4">
                Book Your Session
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6">
                Begin Your Transformation
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Choose the session type that fits your needs. Every journey starts with a single step.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl text-[#1E3A32] text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D8B46B] text-white flex items-center justify-center text-2xl font-serif mx-auto mb-4">
                  1
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-2">Choose Your Session</h3>
                <p className="text-[#2B2725]/70">Select the type of session that aligns with your goals</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D8B46B] text-white flex items-center justify-center text-2xl font-serif mx-auto mb-4">
                  2
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-2">Pick Your Time</h3>
                <p className="text-[#2B2725]/70">Select from available dates and times that work for you</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D8B46B] text-white flex items-center justify-center text-2xl font-serif mx-auto mb-4">
                  3
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-2">Get Started</h3>
                <p className="text-[#2B2725]/70">Receive confirmation and prepare for your transformation</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            {Object.entries(groupedServices).map(([type, services]) => {
              const category = serviceCategories[type];
              if (!category) return null;

              return (
                <div key={type} className="mb-16">
                  <div className="mb-8">
                    <h2 
                      className="font-serif text-3xl md:text-4xl mb-3"
                      style={{ color: category.color }}
                    >
                      {category.title}
                    </h2>
                    <p className="text-[#2B2725]/70 text-lg">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services
                      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                      .map((service) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                          <div className="p-8 flex-1">
                            <h3 className="font-serif text-2xl text-[#1E3A32] mb-3">
                              {service.name}
                            </h3>
                            {service.description && (
                              <p className="text-[#2B2725]/70 mb-6 leading-relaxed">
                                {service.description}
                              </p>
                            )}

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 text-sm text-[#2B2725]/70">
                                <Clock size={16} className="text-[#D8B46B]" />
                                <span>{service.duration} minutes</span>
                              </div>
                              {service.zoom_enabled && (
                                <div className="flex items-center gap-2 text-sm text-[#2B2725]/70">
                                  <Video size={16} className="text-[#D8B46B]" />
                                  <span>Virtual session via Zoom</span>
                                </div>
                              )}
                              {service.session_count > 1 && (
                                <div className="flex items-center gap-2 text-sm text-[#2B2725]/70">
                                  <CheckCircle size={16} className="text-[#D8B46B]" />
                                  <span>{service.session_count} sessions included</span>
                                </div>
                              )}
                            </div>

                            <div className="pt-6 border-t border-[#E4D9C4]">
                              <div className="flex items-baseline justify-between mb-4">
                                <span className="font-serif text-4xl text-[#1E3A32]">
                                  {formatPrice(service.price)}
                                </span>
                                {service.session_count > 1 && (
                                  <span className="text-sm text-[#2B2725]/60">
                                    {formatPrice(service.price / service.session_count)}/session
                                  </span>
                                )}
                              </div>
                              <Button 
                                className="w-full bg-[#1E3A32] hover:bg-[#2B4A40] text-white"
                                onClick={() => window.location.href = createPageUrl(`BookAppointment?type=${service.id}`)}
                              >
                                Book Now
                                <ArrowRight size={18} className="ml-2" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-[#1E3A32] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Book a complimentary consultation to discuss your goals and find the right path forward.
            </p>
            <Button 
              size="lg"
              className="bg-[#D8B46B] hover:bg-[#C9A55B] text-[#1E3A32] font-medium px-8 py-6 text-lg"
              onClick={() => window.location.href = createPageUrl('Contact')}
            >
              Schedule a Free Consultation
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}