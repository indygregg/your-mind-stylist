import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Video, CheckCircle, ArrowRight, ArrowLeft, Settings } from "lucide-react";
import { createPageUrl } from "../utils";
import SEO from "../components/SEO";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { format } from "date-fns";
import CmsText from "@/components/cms/CmsText";

export default function Bookings() {
  const [step, setStep] = useState(1); // 1: Browse types, 2: Select slot, 3: Enter details, 4: Confirming
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null);
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    notes: ""
  });

  const { data: appointmentTypes = [], isLoading } = useQuery({
    queryKey: ["appointmentTypes"],
    queryFn: () => base44.entities.AppointmentType.filter({ active: true }),
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setClientDetails({
          name: currentUser.full_name || "",
          email: currentUser.email || "",
          notes: ""
        });
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const handleSelectAppointment = (apt) => {
    setSelectedAppointment(apt);
    setStep(2);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleSubmitDetails = async () => {
    if (!clientDetails.name || !clientDetails.email) {
      alert("Please fill in your name and email");
      return;
    }

    setStep(4); // Show confirming state

    try {
      const response = await base44.functions.invoke('createBookingCheckout', {
        appointment_type_id: selectedAppointment.id,
        scheduled_date: selectedSlot.start,
        client_name: clientDetails.name,
        client_email: clientDetails.email,
        client_notes: clientDetails.notes
      });

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      alert('Failed to create booking: ' + error.message);
      setStep(3);
    }
  };

  const formatPrice = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const getPriceLabel = (apt) => {
    if (apt.price === 0) return "No payment required";
    return "Payment required to confirm";
  };

  const getCtaLabel = (apt) => {
    if (apt.price === 0) return "Book This Session";
    return "Continue to Secure Checkout";
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

  // Manager view banner
  const isManager = user?.role === 'admin' || user?.role === 'manager';

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
        {/* Manager View Banner */}
        {isManager && step === 1 && (
          <div className="bg-[#1E3A32] text-white py-3 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span className="text-sm font-medium">Manager View</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-[#1E3A32]"
                  onClick={() => window.location.href = createPageUrl('ManagerCalendar')}
                >
                  Open Calendar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-[#1E3A32]"
                  onClick={() => window.location.href = createPageUrl('ManagerAppointments')}
                >
                  Edit Appointment Types
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - Only show on step 1 */}
        {step === 1 && (
          <section className="relative pt-32 pb-12 px-6 bg-gradient-to-br from-[#1E3A32] to-[#2B4A40] text-white">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#D8B46B] text-sm tracking-[0.3em] uppercase mb-4 block">
                Book Your Session
              </span>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">
                Begin Your Transformation
              </h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Choose the session type that fits your needs. Every journey starts with a single step.
              </p>
            </motion.div>
          </div>
        </section>
        )}

        {/* Progress Indicator - Show on steps 2, 3, 4 */}
        {step > 1 && step < 4 && (
          <div className="bg-white border-b border-[#E4D9C4] py-6 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-[#2B2725]/70 hover:text-[#1E3A32]"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      step >= 1 ? 'bg-[#D8B46B] text-white' : 'bg-[#E4D9C4] text-[#2B2725]/60'
                    }`}>1</div>
                    <span className="text-xs hidden sm:inline">Service</span>
                  </div>
                  <div className="w-8 h-[2px] bg-[#E4D9C4]"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      step >= 2 ? 'bg-[#D8B46B] text-white' : 'bg-[#E4D9C4] text-[#2B2725]/60'
                    }`}>2</div>
                    <span className="text-xs hidden sm:inline">Time</span>
                  </div>
                  <div className="w-8 h-[2px] bg-[#E4D9C4]"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      step >= 3 ? 'bg-[#D8B46B] text-white' : 'bg-[#E4D9C4] text-[#2B2725]/60'
                    }`}>3</div>
                    <span className="text-xs hidden sm:inline">Details</span>
                  </div>
                </div>
                <div className="w-20"></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Services Grid */}
        {step === 1 && (
          <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            {appointmentTypes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="bg-white p-12 shadow-md max-w-2xl mx-auto">
                  <Calendar size={64} className="mx-auto mb-6 text-[#D8B46B]" />
                  <h3 className="font-serif text-2xl text-[#1E3A32] mb-4">
                    Booking Setup Required
                  </h3>
                  <p className="text-[#2B2725]/70 mb-6">
                    No appointment types are available yet. Set up your services to start accepting bookings.
                  </p>
                  {isManager && (
                    <Button
                      onClick={() => window.location.href = createPageUrl('ManagerAppointments')}
                      className="bg-[#1E3A32] hover:bg-[#2B4A40]"
                    >
                      Create Appointment Types
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              ['private_sessions', 'consultation', 'certification']
                .filter(type => groupedServices[type])
                .map((type) => {
                const services = groupedServices[type];
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
                                onClick={() => handleSelectAppointment(service)}
                              >
                                {getCtaLabel(service)}
                                <ArrowRight size={18} className="ml-2" />
                              </Button>
                              <p className="text-xs text-center text-[#2B2725]/60 mt-2">
                                You'll choose a date and time next.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              );
              })
            )}
          </div>
        </section>
        )}

        {/* Step 2: Calendar / Timeslot Picker */}
        {step === 2 && selectedAppointment && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-[#1E3A32] mb-2">Select a Date & Time</h2>
                  <p className="text-[#2B2725]/70">Available times are shown in your local time zone.</p>
                </div>

                <div className="bg-white p-6 shadow-md mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-[#1E3A32] mb-1">{selectedAppointment.name}</h3>
                      <p className="text-sm text-[#2B2725]/70">{selectedAppointment.duration} minutes • {formatPrice(selectedAppointment.price)}</p>
                    </div>
                  </div>
                </div>

                <BookingCalendar
                  appointmentType={selectedAppointment}
                  onSlotSelected={handleSelectSlot}
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Step 3: Client Details Form */}
        {step === 3 && selectedAppointment && selectedSlot && (
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 shadow-md"
              >
                <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Your Details</h2>

                {/* Selected appointment summary */}
                <div className="bg-[#F9F5EF] p-4 mb-6 border-l-4 border-[#D8B46B]">
                  <div className="text-sm text-[#2B2725]/70 mb-1">You're booking:</div>
                  <div className="font-medium text-[#1E3A32]">{selectedAppointment.name}</div>
                  <div className="text-sm text-[#2B2725]/70 mt-1">
                    {format(new Date(selectedSlot.start), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={clientDetails.name}
                      onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={clientDetails.email}
                      onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label>Optional Notes</Label>
                    <Textarea
                      value={clientDetails.notes}
                      onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
                      placeholder="If you'd like, share anything you want me to know before we meet. This is optional."
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitDetails}
                  className="w-full bg-[#1E3A32] hover:bg-[#2B4A40] text-white"
                  size="lg"
                >
                  {selectedAppointment.price === 0 ? 'Confirm Booking' : 'Continue to Secure Checkout'}
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Step 4: Payment Processing */}
        {step === 4 && (
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-white p-12 shadow-md">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A32] mx-auto mb-6"></div>
                  <h2 className="font-serif text-3xl text-[#1E3A32] mb-4">Secure Checkout</h2>
                  <p className="text-[#2B2725]/70 mb-2">
                    You'll complete payment through Stripe to confirm your session.
                  </p>
                  <p className="text-sm text-[#2B2725]/60">
                    Your time will be held while you check out.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section - Only show on step 1 */}
        {step === 1 && (
          <section className="py-16 px-6 bg-[#1E3A32] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Book a complimentary consultation to discuss your goals and find the right path forward.
            </p>
            <Button 
              size="lg"
              className="bg-[#D8B46B] hover:bg-[#C9A55B] text-[#1E3A32] font-medium px-8 py-4"
              onClick={() => window.location.href = createPageUrl('Contact')}
            >
              Schedule a Free Consultation
            </Button>
          </div>
        </section>
        )}
      </div>
    </>
  );
}