import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, Clock, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function BugList() {
  const [user, setUser] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set(["home", "freemasterclass", "about"]));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Redirect non-managers
        if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && currentUser.custom_role !== 'manager') {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        navigate(createPageUrl('Dashboard'));
      }
    };
    checkAuth();
  }, [navigate]);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const bugs = [
    {
      category: "Home Page",
      categoryId: "home",
      priority: "low",
      items: [
        {
          id: "home-1",
          title: "Increase font size for 'Companies I've Worked with' heading",
          description: "The heading is smaller than the company names below it",
          status: "completed",
          priority: "low"
        }
      ]
    },
    {
      category: "FreeMasterclass Page",
      categoryId: "freemasterclass",
      priority: "high",
      items: [
        {
          id: "fmc-1",
          title: "Edit buttons link to other pages instead of allowing editing",
          description: "Edit buttons work like links to other pages instead of opening inline editor",
          status: "completed",
          priority: "high"
        }
      ]
    },
    {
      category: "About Page",
      categoryId: "about",
      priority: "high",
      items: [
        {
          id: "about-1",
          title: "Edit buttons under 'Work With Me' redirect to other pages",
          description: "Private Mind Styling and other edit buttons take user to linked pages instead of allowing editing",
          status: "completed",
          priority: "high"
        },
        {
          id: "about-2",
          title: "Back button causes website to quit",
          description: "Using browser back button after clicking edit buttons causes website to crash/quit",
          status: "completed",
          priority: "high"
        }
      ]
    },
    {
      category: "Programs Page",
      categoryId: "programs",
      priority: "medium",
      items: [
        {
          id: "programs-1",
          title: "Need way to list multiple webinars at $9.00",
          description: "Currently only space for one webinar. Need to sell multiple webinars",
          status: "completed",
          priority: "medium",
          notes: "Programs page now has dedicated Webinars section. Add webinars via Manager Dashboard → Course Manager (or create products with subtype='webinar'). They'll automatically appear in the 'Webinars & Live Events' section."
        },
        {
          id: "programs-2",
          title: "Need way to list multiple books for sale",
          description: "Same issue as webinars - need to list multiple books",
          status: "completed",
          priority: "medium",
          notes: "Programs page now has dedicated Books section. Create products in Manager Dashboard → Product Manager with subtype='book'. They'll automatically appear in the 'Books & Resources' section."
        }
      ]
    },
    {
      category: "Pocket Mindset Page",
      categoryId: "pocketmindset",
      priority: "medium",
      items: [
        {
          id: "pocket-1",
          title: "Cannot edit page content",
          description: "Edit functionality not working on this page",
          status: "completed",
          priority: "medium",
          notes: "ManagerBar now appears on all authenticated pages including PocketMindset. Toggle edit mode and click any text to edit."
        },
        {
          id: "pocket-2",
          title: "Item #4 won't be available with current app",
          description: "Need to address what content is shown",
          status: "completed",
          priority: "low",
          notes: "Page fully editable via CMS. Step 4 content can be updated to reflect current functionality."
        }
      ]
    },
    {
      category: "Initial Consultation Page",
      categoryId: "consultation",
      priority: "high",
      items: [
        {
          id: "consult-1",
          title: "Cannot link to documents",
          description: "Need to link documents and edit intake form",
          status: "completed",
          priority: "high",
          notes: "Document links are now editable via CMS (consultations.step1.doc1.link, doc2.link, doc3.link, doc4.link). Edit mode enabled. Manager can also click 'Edit Form Questions (Manager)' to edit the questionnaire."
        },
        {
          id: "consult-2",
          title: "Cannot view or edit questionnaire",
          description: "Questionnaire page not accessible for editing",
          status: "completed",
          priority: "high",
          notes: "Added 'Edit Form Questions (Manager)' button on Consultations page that links to ConsultationFormEditor. Managers can edit all intake form questions there."
        }
      ]
    },
    {
      category: "Domain Settings",
      categoryId: "domain",
      priority: "low",
      items: [
        {
          id: "domain-1",
          title: "Primary domain shows 'themindstylist' instead of 'yourmindstylist.com'",
          description: "Check if this matters for functionality",
          status: "open",
          priority: "low"
        }
      ]
    },
    {
      category: "Course Manager",
      categoryId: "courses",
      priority: "high",
      items: [
        {
          id: "course-1",
          title: "Prevent video downloads",
          description: "Don't want students to be able to download videos in any courses",
          status: "completed",
          priority: "high",
          notes: "Video downloads now blocked via controlsList='nodownload' and right-click disabled. Vimeo embeds include download=0 parameter."
        },
        {
          id: "course-2",
          title: "Stripe pricing for multiple courses",
          description: "Most students take all courses. Need to know if each course charges full price or if should create bundle",
          status: "completed",
          priority: "high",
          notes: "Bundle system is ready! Go to Manager Dashboard → Product Manager → Click 'Create Bundle'. Courses can be sold individually OR as a discounted bundle. Each course needs a linked Product, then bundle them together with custom pricing. Bundles auto-sync with Stripe."
        },
        {
          id: "course-3",
          title: "Course merging functionality",
          description: "If need to create 1 course, can courses be merged in order or need to rebuild?",
          status: "completed",
          priority: "medium",
          notes: "Course Merger tool added! In Course Manager, click 'Merge Courses' button. Select 2+ courses, they'll be combined into one new course (in selected order) as a draft. Original courses remain unchanged."
        }
      ]
    },
    {
      category: "Booking Setup",
      categoryId: "booking",
      priority: "critical",
      items: [
        {
          id: "booking-1",
          title: "Zoom integration failing",
          description: "Error: Invalid client_id: YOUR_CLIENT_ID (4,700)",
          status: "completed",
          priority: "critical"
        },
        {
          id: "booking-2",
          title: "Zoom app disabled temporarily",
          description: "Error: This app has been disabled by Zoom temporarily (4,704)",
          status: "completed",
          priority: "critical"
        },
        {
          id: "booking-3",
          title: "Mac Calendar integration - 500 error",
          description: "Getting 500 error when trying to connect with Mac Calendar. Note: Google Calendar must be connected first before Mac Calendar sync will work.",
          status: "open",
          priority: "high",
          notes: "Instructions for Mac Calendar sync are available on the Integration Setup page. You must connect Google Calendar first (under Dashboard → Integration Setup). Once Google is connected, you can sync it with Apple Calendar on your Mac via System Settings → Internet Accounts → Add Google account. Google Calendar connection status: Not connected yet - visit Integration Setup to connect."
        },
        {
          id: "booking-4",
          title: "No availability slots showing in test",
          description: "Set up hours for each appointment type but no slots available when testing",
          status: "completed",
          priority: "critical"
        }
      ]
    },
    {
      category: "Content Alchemy Suite",
      categoryId: "alchemy",
      priority: "medium",
      items: [
        {
          id: "alchemy-1",
          title: "Configure AI to write in Roberta's voice",
          description: "Need instructions/setup for voice profile",
          status: "open",
          priority: "medium"
        }
      ]
    },
    {
      category: "Product Manager",
      categoryId: "products",
      priority: "high",
      items: [
        {
          id: "products-1",
          title: "Payment plans not working",
          description: "Payment plan functionality needs to be fixed",
          status: "open",
          priority: "high"
        }
      ]
    },
    {
      category: "Email System",
      categoryId: "emails",
      priority: "medium",
      items: [
        {
          id: "email-1",
          title: "Email editing location unclear",
          description: "Where to edit and control emails - in MailerLite?",
          status: "open",
          priority: "medium"
        },
        {
          id: "email-2",
          title: "Forward RF and FARE emails",
          description: "Forward RF and FARE emails to Your Mind Stylist",
          status: "open",
          priority: "high"
        },
        {
          id: "email-3",
          title: "Forward Roberta Fernandez website emails",
          description: "Forward Roberta Fernandez website emails to yourmindstylist.com",
          status: "open",
          priority: "high"
        }
      ]
    },
    {
      category: "Miscellaneous",
      categoryId: "misc",
      priority: "high",
      items: [
        {
          id: "misc-1",
          title: "Forward Roberta Fernandez site - END OF MONTH",
          description: "Forward Roberta Fernandez site and email to yourmindstylist.com - Roberta Fernandez goes offline Feb 2",
          status: "open",
          priority: "critical",
          deadline: "Feb 2, 2026"
        },
        {
          id: "misc-2",
          title: "Confirm booking sends via Gmail",
          description: "Does booking send via gmail? Need to get scheduler working",
          status: "open",
          priority: "high"
        },
        {
          id: "misc-3",
          title: "Need to connect to Zoom",
          description: "Need Zoom connection for scheduler",
          status: "open",
          priority: "critical"
        },
        {
          id: "misc-4",
          title: "Gift products to clients",
          description: "Need ability to gift Pocket Mindset™, workshops, etc. without charging",
          status: "open",
          priority: "high"
        },
        {
          id: "misc-5",
          title: "Set up bundling in Stripe",
          description: "Need bundling option so don't have to rebuild training course",
          status: "completed",
          priority: "high",
          notes: "Bundle system is ready! Go to Manager Dashboard → Product Manager → Click 'Create Bundle'. Follow 4-step wizard: (1) Name your bundle, (2) Select products to include, (3) Set bundle price (system calculates savings), (4) Review & publish. Bundles auto-sync with Stripe."
        },
        {
          id: "misc-6",
          title: "Add video to Initial Consultation page",
          description: "Add https://vimeo.com/1158905462?fl=ip&fe=ec",
          status: "completed",
          priority: "medium"
        },
        {
          id: "misc-7",
          title: "Add video to Cleaning Out Your Closet™ page",
          description: "Add https://vimeo.com/1158916467?fl=ml&fe=ec",
          status: "completed",
          priority: "medium"
        },
        {
          id: "misc-8",
          title: "Add video to Pocket Mindset™ page",
          description: "Add https://vimeo.com/1158920818?fl=ml&fe=ec",
          status: "completed",
          priority: "medium"
        },
        {
          id: "misc-9",
          title: "Home page video not recognizable as video",
          description: "Video looks like a picture, not clearly a playable video",
          status: "completed",
          priority: "low"
        },
        {
          id: "misc-10",
          title: "Test hypnosis course with student",
          description: "Is course site functional? Is CRM functional for client setup?",
          status: "open",
          priority: "medium"
        },
        {
          id: "misc-11",
          title: "Pocket Mindset™ purchase email automation",
          description: "Email needs to go out with app setup instructions and code 935384",
          status: "open",
          priority: "high",
          notes: "See full email template in description"
        }
      ]
    },
    {
      category: "User Dashboard",
      categoryId: "userdashboard",
      priority: "medium",
      items: [
        {
          id: "dash-1",
          title: "Clarify if AI is generating responses",
          description: "Is AI generating these responses?",
          status: "open",
          priority: "low"
        },
        {
          id: "dash-2",
          title: "'What I don't do?' appears in multiple places",
          description: "What should be there instead?",
          status: "open",
          priority: "medium"
        }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: bugs.reduce((acc, cat) => acc + cat.items.length, 0),
    critical: bugs.reduce((acc, cat) => acc + cat.items.filter(i => i.priority === "critical").length, 0),
    high: bugs.reduce((acc, cat) => acc + cat.items.filter(i => i.priority === "high").length, 0),
    medium: bugs.reduce((acc, cat) => acc + cat.items.filter(i => i.priority === "medium").length, 0),
    low: bugs.reduce((acc, cat) => acc + cat.items.filter(i => i.priority === "low").length, 0),
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="animate-pulse text-[#1E3A32]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-4">Bug & Issue Tracker</h1>
            <p className="text-[#2B2725]/70">
              Roberta's reported issues and change requests
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 border-l-4 border-[#1E3A32]">
              <div className="text-2xl font-bold text-[#1E3A32]">{stats.total}</div>
              <div className="text-sm text-[#2B2725]/60">Total Issues</div>
            </div>
            <div className="bg-white p-4 border-l-4 border-red-500">
              <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
              <div className="text-sm text-[#2B2725]/60">Critical</div>
            </div>
            <div className="bg-white p-4 border-l-4 border-orange-500">
              <div className="text-2xl font-bold text-orange-700">{stats.high}</div>
              <div className="text-sm text-[#2B2725]/60">High Priority</div>
            </div>
            <div className="bg-white p-4 border-l-4 border-yellow-500">
              <div className="text-2xl font-bold text-yellow-700">{stats.medium}</div>
              <div className="text-sm text-[#2B2725]/60">Medium Priority</div>
            </div>
            <div className="bg-white p-4 border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-700">{stats.low}</div>
              <div className="text-sm text-[#2B2725]/60">Low Priority</div>
            </div>
          </div>

          {/* Bug List */}
          <div className="space-y-6">
            {bugs.map((category) => {
              const isExpanded = expandedCategories.has(category.categoryId);
              const categoryPriority = category.priority;
              
              return (
                <div key={category.categoryId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.categoryId)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      <h3 className="font-serif text-xl text-[#1E3A32]">{category.category}</h3>
                      <Badge className={getPriorityColor(categoryPriority)}>
                        {category.items.length} {category.items.length === 1 ? 'issue' : 'issues'}
                      </Badge>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {category.items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`px-6 py-4 ${index !== category.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {item.status === "completed" ? (
                                 <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                                ) : (
                                 <Circle size={18} className="text-orange-500 flex-shrink-0" />
                                )}
                                <h4 className="font-medium text-[#1E3A32]">{item.title}</h4>
                                <Badge className={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                                {item.deadline && (
                                  <Badge className="bg-red-100 text-red-800 border-red-200">
                                    <Clock size={12} className="mr-1" />
                                    {item.deadline}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-[#2B2725]/70 ml-7">{item.description}</p>
                              {item.notes && (
                                <p className="text-xs text-[#2B2725]/50 ml-7 mt-2 italic">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}