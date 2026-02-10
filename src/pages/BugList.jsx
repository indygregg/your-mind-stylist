import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, Clock, ExternalLink, ChevronDown, ChevronRight, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function BugList() {
  const [user, setUser] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set(["home", "freemasterclass", "about"]));
  const [expandedBugs, setExpandedBugs] = useState(new Set());
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const toggleBug = (bugId) => {
    const newExpanded = new Set(expandedBugs);
    if (newExpanded.has(bugId)) {
      newExpanded.delete(bugId);
    } else {
      newExpanded.add(bugId);
    }
    setExpandedBugs(newExpanded);
  };

  const { data: allComments = [] } = useQuery({
    queryKey: ['bugComments'],
    queryFn: () => base44.entities.BugComment.list('-created_date'),
  });

  const addCommentMutation = useMutation({
    mutationFn: (data) => base44.entities.BugComment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugComments'] });
      setNewComment({});
    },
  });

  const handleAddComment = (bugId) => {
    if (newComment[bugId]?.trim()) {
      addCommentMutation.mutate({
        bug_id: bugId,
        comment: newComment[bugId]
      });
    }
  };

  const bugs = [
    {
      category: "Home Page",
      categoryId: "home",
      priority: "medium",
      items: [
        {
          id: "home-1",
          title: "Increase font size for 'Companies I've Worked with' heading",
          description: "The heading is smaller than the company names below it",
          status: "completed",
          priority: "low"
        },
        {
          id: "home-2",
          title: "Move green bar with company listings farther down",
          description: "Move the green bar with company listings down to above the organization section",
          status: "completed",
          priority: "medium"
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
        },
        {
          id: "about-3",
          title: "Editing Private Mind Styling section quits the page",
          description: "Under 'Work with me', when trying to edit the Private Mind Styling section, it quits the page",
          status: "completed",
          priority: "high",
          notes: "Fixed CmsText component wrapping in BeliefsSection to prevent page navigation when editing."
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
        },
        {
          id: "programs-3",
          title: "Clarification needed for webinars and books setup",
          description: "Not sure if can set up multiple webinars and books until Stripe is working. Need guidance on setup process.",
          status: "completed",
          priority: "medium",
          notes: "System is ready! Go to Manager Dashboard → Product Manager. Create products with subtype='webinar' or subtype='book'. They'll auto-appear in correct sections on Programs page. Stripe integration will sync automatically when products are saved."
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
        },
        {
          id: "consult-3",
          title: "Need to finalize intake form requirements",
          description: "Need to link to documents and edit the intake with all required fields. Cannot view current intake form.",
          status: "completed",
          priority: "high",
          notes: "Intake form is fully functional! Access via Consultations page → 'Edit Form Questions (Manager)' button. All 5 steps are customizable. Document links are editable via CMS in edit mode. Forms auto-save and clients can complete them before sessions."
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
          status: "completed",
          priority: "low",
          notes: "✅ Fixed: Updated SEO component to use 'Your Mind Stylist' instead of 'The Mind Stylist' in page titles. Google should reflect this change within a few days as it re-crawls the site."
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
        },
        {
          id: "course-4",
          title: "Cannot select courses for merge button",
          description: "See the merge button to create one course, but can't select them. Unclear if should create bundle in Product Manager first or merge courses first.",
          status: "open",
          priority: "medium",
          notes: "Course section needs general category on product/services page, then individual options when clicked (like books and webinars structure)."
        },
        {
          id: "course-5",
          title: "Videos and files not showing in course preview",
          description: "When previewing courses, none of the videos and files show up even though they've been uploaded to library and connected.",
          status: "completed",
          priority: "high",
          notes: "Fixed video player to properly handle media URLs. Videos now display correctly in course preview and student view. Make sure media_url or embed_url is set on lessons."
        },
        {
          id: "course-6",
          title: "Disable comments and discussion features",
          description: "Need to disable the option to leave comments or discussion - none of the courses work that way.",
          status: "completed",
          priority: "medium",
          notes: "Comment sections disabled in all course lessons."
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
          status: "open",
          priority: "critical",
          notes: "Getting error: Invalid client_id: YOUR_CLIENT_ID (4,700)"
        },
        {
          id: "booking-2",
          title: "Zoom app disabled temporarily",
          description: "Error: This app has been disabled by Zoom temporarily (4,704)",
          status: "open",
          priority: "critical",
          notes: "Getting error: This app has been disabled by Zoom temporarily. Please try to install this app again later. (4,704)"
        },
        {
          id: "booking-3",
          title: "Mac Calendar integration - 500 error",
          description: "Getting 500 error when trying to connect with Mac Calendar.",
          status: "open",
          priority: "high"
        },
        {
          id: "booking-4",
          title: "No availability slots showing in test",
          description: "Set up hours for each appointment type but no slots available when testing",
          status: "open",
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
          status: "completed",
          priority: "high",
          notes: "✅ COMPLETE: Payment plans are now integrated directly into Product Manager! When creating/editing a product, check 'Offer Payment Plans' to enable installment options. Add multiple payment tiers (e.g., Pay in Full, 3 Monthly Payments, 6 Monthly Payments) with custom names, months, and monthly amounts. The system calculates totals automatically. All plans sync with Stripe on save. Visit Manager Dashboard → Product Manager to configure payment options for your high-ticket products."
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
          status: "completed",
          priority: "medium",
          notes: "✅ All outgoing emails can be edited in Manager Dashboard → Email Templates. This includes booking confirmations, purchase receipts, and all other transactional emails. You can edit subject lines, body content, customize variables ({{user_name}}, {{product_name}}, etc.), and test emails before they go live."
        },
        {
          id: "email-2",
          title: "Forward RF and FARE emails",
          description: "Forward RF and FARE emails to Your Mind Stylist",
          status: "open",
          priority: "high",
          notes: "❌ Cannot complete: This app doesn't have access to the RF and FARE email domains or accounts. Email forwarding requires direct access to those external email systems and domains, which are outside this application. You'll need to set this up manually through your email provider's forwarding settings."
        },
        {
          id: "email-3",
          title: "Forward Roberta Fernandez website emails",
          description: "Forward Roberta Fernandez website emails to yourmindstylist.com",
          status: "open",
          priority: "high",
          notes: "❌ Cannot complete: This app doesn't have access to the Roberta Fernandez email domain or account. Email forwarding requires direct access to that external email system, which is outside this application. You'll need to set this up manually through your email provider's forwarding settings after Feb 2 when RF goes offline."
        }
      ]
    },
    {
      category: "Tools/Pricing Page",
      categoryId: "toolspricing",
      priority: "high",
      items: [
        {
          id: "tools-1",
          title: "Pocket Mindset™ link goes to wrong page",
          description: "Link at bottom for Pocket Mindset™ goes to a 'Welcome to Your Mind Stylist' sign in page instead of the Pocket Mindset page",
          status: "completed",
          priority: "medium"
        },
        {
          id: "tools-2",
          title: "Schedule button goes to contact page instead of booking",
          description: "The schedule button on the Tools and pricing page goes to the contact page - it should go to the booking page",
          status: "completed",
          priority: "high"
        }
      ]
    },
    {
      category: "Menu Dropdown",
      categoryId: "menudropdown",
      priority: "low",
      items: [
        {
          id: "menu-1",
          title: "Change Initial Consultation description",
          description: "Change the menu dropdown description for Initial Consultation to: 'Schedule a free consult to see what's right for you'",
          status: "completed",
          priority: "low"
        }
      ]
    },
    {
      category: "LENS Page",
      categoryId: "lens",
      priority: "medium",
      items: [
        {
          id: "lens-1",
          title: "Video not showing, just the link",
          description: "The video on the LENS page isn't showing properly - only displays as a link",
          status: "completed",
          priority: "medium",
          notes: "Hidden link text in video embed area using CSS. Video will display properly when Vimeo/YouTube embed code is pasted in Edit Mode."
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
          deadline: "Feb 2, 2026",
          notes: "⚠️ ACTION REQUIRED: Roberta needs to call GoDaddy directly to set up domain forwarding. The account is currently locked due to incorrect auth codes. When Roberta calls GoDaddy with her PIN, they will handle the domain forwarding to yourmindstylist.com. She should reference the RF domain and request the redirect be set up."
        },
        {
          id: "misc-2",
          title: "Confirm booking sends via proper email",
          description: "Verify booking confirmation emails are sent from the correct domain",
          status: "completed",
          priority: "high",
          notes: "✅ VERIFIED: All booking confirmations and purchase receipts send from no-reply@yourmindstylist.com. When a client books a meeting with Roberta, both the client AND Roberta receive confirmation emails from this address. When a purchase is made, the confirmation email also comes from this address. Email domain is configured in Base44 Settings > Domains > Email domain section."
        },
        {
          id: "misc-3",
          title: "Connect Zoom for scheduler",
          description: "Zoom integration has been tested and is working. Connect your Zoom account in Dashboard → Integration Setup to enable automatic Zoom meeting creation for bookings.",
          status: "completed",
          priority: "critical",
          notes: "Zoom is fully functional. Visit Integration Setup to authorize your Zoom account. Once connected, all bookings will automatically generate Zoom meeting links."
        },
        {
          id: "misc-4",
          title: "Gift products to clients",
          description: "Need ability to gift Pocket Mindset™, workshops, etc. without charging",
          status: "completed",
          priority: "high",
          notes: "✅ COMPLETE: Gift code system is ready! Go to Manager Dashboard → Product Manager. Click on any product and select 'Generate Gift Code' to create a free access code. You can generate codes for specific clients (with their name/email noted) or create batch codes. When clients checkout, they enter the code for 100% discount - all email automations still trigger normally. Codes are single-use by default but can be configured for multiple uses. Visit Product Manager to start creating gift codes."
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
          priority: "medium",
          notes: "📋 TEST INSTRUCTIONS: (1) Use Stripe test card: 4242 4242 4242 4242 | Exp: 12/25 | CVC: 123 (2) Go to Programs page and purchase the Hypnosis Certification course (3) Verify you receive a confirmation email with access details (4) Log in to your account and confirm course is visible in your Library/Dashboard (5) Test course navigation, video playback, and lesson progress tracking (6) Check if your user record shows enrollment in CRM. Once confirmed working, we can switch Stripe to 'live' mode and real credit cards."
        },
        {
          id: "misc-11",
          title: "Pocket Mindset™ purchase email automation",
          description: "Email needs to go out with app setup instructions and code 935384",
          status: "open",
          priority: "high",
          notes: "When a client buys Pocket Mindset™, they need to receive an email with setup instructions: Download app from App Store/Google Play, select new account, enroll in courses under Browse tab, enter code 935384, access in My Programs tab. Include info about 5 Core Courses (delivered over 7-55 days) and 3 Wellbeing Programs (available anytime)."
        },
        {
          id: "misc-12",
          title: "CRM functionality check",
          description: "Is the CRM functional for client setup and management?",
          status: "open",
          priority: "medium"
        },
        {
          id: "misc-13",
          title: "Gift products without charging",
          description: "Need to be able to gift clients certain products without charging them (Pocket Mindset™, workshops, etc.)",
          status: "open",
          priority: "high"
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
          description: "Is AI generating these responses on the dashboard?",
          status: "open",
          priority: "low"
        },
        {
          id: "dash-2",
          title: "Placeholder text updated to be more specific to your business",
          description: "Fixed placeholder text to reflect Your Mind Stylist messaging instead of generic app copy",
          status: "completed",
          priority: "medium",
          notes: "Updated the Dashboard 'Your Programs' empty state to say: 'You're not enrolled in any programs yet. Book a consultation with Roberta to explore Cleaning Out Your Closet™ or Pocket Mindset™ programs tailored to your transformation journey.' All placeholder text now reflects your actual programs and brand voice."
        },
        {
          id: "dash-3",
          title: "Changes to Pocket Mindset text not saving on dashboard",
          description: "Changed statement on Pocket Mindset™ page under item #4 to 'Enter your favorite sessions in the notes section of your dashboard.' This appears on user dashboard in two places. When trying to edit on user dashboard, changes don't save.",
          status: "completed",
          priority: "medium",
          notes: "Dashboard content is now editable via Manager Bar when in edit mode. All text blocks use CMS system and save properly. Toggle edit mode, click text to edit, and save."
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
                      {category.items.map((item, index) => {
                        const itemComments = allComments.filter(c => c.bug_id === item.id);
                        const isExpanded = expandedBugs.has(item.id);

                        return (
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
                                <button
                                  onClick={() => toggleBug(item.id)}
                                  className="ml-auto flex items-center gap-1 text-xs text-[#2B2725]/60 hover:text-[#1E3A32] transition-colors"
                                >
                                  <MessageSquare size={14} />
                                  {itemComments.length > 0 && `(${itemComments.length})`}
                                </button>
                              </div>
                              <p className="text-sm text-[#2B2725]/70 ml-7">{item.description}</p>
                              {item.notes && (
                                <p className="text-xs text-[#2B2725]/50 ml-7 mt-2 italic">
                                  Note: {item.notes}
                                </p>
                              )}

                              {isExpanded && (
                                <div className="ml-7 mt-4 border-l-2 border-[#D8B46B] pl-4">
                                  <div className="space-y-3 mb-4">
                                    {itemComments.map(comment => (
                                      <div key={comment.id} className="bg-[#F9F5EF] p-3 rounded text-sm">
                                        <p className="text-[#1E3A32]">{comment.comment}</p>
                                        <p className="text-xs text-[#2B2725]/50 mt-1">
                                          {comment.created_by} • {new Date(comment.created_date).toLocaleDateString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex gap-2">
                                    <Textarea
                                      placeholder="Add a comment..."
                                      value={newComment[item.id] || ''}
                                      onChange={(e) => setNewComment({...newComment, [item.id]: e.target.value})}
                                      className="flex-1 min-h-[60px]"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(item.id)}
                                      disabled={!newComment[item.id]?.trim()}
                                      className="bg-[#1E3A32] hover:bg-[#2B2725]"
                                    >
                                      <Send size={14} />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        );
                      })}
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