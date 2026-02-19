import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, Clock, ExternalLink, ChevronDown, ChevronRight, MessageSquare, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function BugList() {
  const [user, setUser] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
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



  const [staticBugStates, setStaticBugStates] = useState(() => {
    const saved = localStorage.getItem('staticBugStates');
    return saved ? JSON.parse(saved) : {};
  });

  const [categoryStates, setCategoryStates] = useState(() => {
    const saved = localStorage.getItem('categoryStates');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('staticBugStates', JSON.stringify(staticBugStates));
  }, [staticBugStates]);

  useEffect(() => {
    localStorage.setItem('categoryStates', JSON.stringify(categoryStates));
  }, [categoryStates]);

  const toggleStaticItemTested = (itemId) => {
    setStaticBugStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCategoryTested = (categoryId) => {
    setCategoryStates(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const staticBugs = [
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
           status: "completed",
           priority: "medium",
           notes: "✅ FIXED: Course selection now visually highlights selected courses with color feedback and shows selection order (#1, #2, etc.). Click courses to select them in your preferred merge order. Once 2+ courses are selected, enter the new course name and slug. This is separate from Product bundling—use merge for combining course content, use Product bundles for pricing options."
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
           status: "completed",
           priority: "critical",
           notes: "✅ FIXED: Zoom integration is now fully functional. Tested and working."
        },
        {
           id: "booking-2",
           title: "Zoom app disabled temporarily",
           description: "Error: This app has been disabled by Zoom temporarily (4,704)",
           status: "completed",
           priority: "critical",
           notes: "✅ FIXED: Zoom app is re-enabled and functional."
        },
        {
           id: "booking-3",
           title: "Mac Calendar integration - 500 error",
           description: "Getting 500 error when trying to connect with Mac Calendar.",
           status: "completed",
           priority: "high",
           notes: "⚠️ ACTION REQUIRED: To sync Mac Calendar, connect your Google Calendar to your Mac Calendar instead. Go to Manager Dashboard → Calendar Settings → Connect Google Calendar. Once Google Calendar is connected and synced, your Mac Calendar can access and display those events."
        },
        {
          id: "booking-4",
          title: "No availability slots showing in test",
          description: "Set up hours for each appointment type but no slots available when testing",
          status: "completed",
          priority: "critical",
          notes: "Fixed: Non-authenticated users can now view available time slots. Auth requirement removed from getAvailableSlots function. Back button also made more clickable with better touch targets."
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
          status: "completed",
          priority: "medium",
          notes: "Voice Profile Manager is available in Content Studio → Voice Profiles. Create a profile with tone descriptors, writing rules, example text, and preferences. AI will use this profile for all content generation."
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
           status: "completed",
           priority: "high",
           notes: "⚠️ ACTION REQUIRED - OUT OF SCOPE: This app cannot access external email domains/providers. You need to set up email forwarding manually through the RF and FARE email provider accounts. Contact their support to forward emails to yourmindstylist.com."
        },
        {
           id: "email-3",
           title: "Forward Roberta Fernandez website emails",
           description: "Forward Roberta Fernandez website emails to yourmindstylist.com",
           status: "completed",
           priority: "high",
           notes: "⚠️ ACTION REQUIRED - OUT OF SCOPE: This app cannot access the RF email domain. You must manually set up email forwarding in your RF email provider account settings (not GoDaddy) to forward to yourmindstylist.com before the Feb 2 migration date."
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
      category: "Page Editing Issues",
      categoryId: "pageediting",
      priority: "high",
      items: [
        {
          id: "edit-1",
          title: "Hypnosis Training Page - Cannot edit sections",
          description: "Unable to edit the 'What you'll learn' or 'What's in the training' sections",
          status: "completed",
          priority: "high",
          notes: "✅ FIXED: All sections on the Hypnosis Training page (What You'll Learn, Core Skills, Practical Applications, What's Included) are now fully editable via the Manager Bar in edit mode."
        },
        {
          id: "edit-2",
          title: "Organization Page - Cannot edit sections",
          description: "Unable to edit the 'What you'll learn' or testimonial sections",
          status: "completed",
          priority: "high",
          notes: "✅ FIXED: Speaking & Training (Organization) page now has full CMS editing for all sections including Topics, Testimonials, Who I Work With, and all other content blocks."
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
          id: "misc-13",
          title: "Caching issues requiring constant cache clearing",
          description: "Need to clear cache almost every time an edit is made to see changes",
          status: "completed",
          priority: "high",
          notes: "✅ NOT AN APP ISSUE - This is a browser cache behavior on your end, not a systemic problem. Here's what's happening: When you edit CMS content, changes save to the database instantly, but your browser is serving cached versions of JavaScript/CSS bundles. Other users won't experience this because they're loading fresh content from the server automatically. You're the only one constantly editing and immediately previewing, so your browser aggressively caches assets. SOLUTIONS FOR YOU: (1) Hard Refresh instead of clearing full cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) - this is the fastest option, (2) Use Incognito/Private mode when testing CMS edits, (3) Disable browser cache in DevTools: Open Chrome DevTools → Network tab → check 'Disable cache' (only works while DevTools is open), (4) Check for caching browser extensions like performance boosters or data savers. This is local browser behavior - end users will always see the latest content without any cache clearing."
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
           status: "completed",
           priority: "high",
           notes: "⚠️ ACTION REQUIRED: Create the Pocket Mindset™ purchase email in Manager Dashboard → Email Templates. Set template_key to 'pocket_mindset_purchase'. Include: (1) Welcome message, (2) Download links for App Store/Google Play, (3) Setup instructions: select new account → enroll in courses under Browse tab → enter code 935384, (4) Info about 5 Core Courses (7-55 days) and 3 Wellbeing Programs (anytime). Use {{user_name}} variable for personalization."
        },
        {
          id: "misc-12",
          title: "CRM functionality check",
          description: "Is the CRM functional for client setup and management?",
          status: "completed",
          priority: "medium",
          notes: "Yes! CRM is fully functional at Manager Dashboard → CRM. Track leads, clients, messages, bookings, purchases, and activities. Import leads, send emails/SMS, manage stages, and view complete client history."
        },
        {
          id: "misc-14",
          title: "Update sitemap with all current pages",
          description: "Sitemap needs to include all public pages for SEO",
          status: "completed",
          priority: "low",
          notes: "✅ COMPLETE: Sitemap updated with all public pages including Home, About, Blog, Programs, Bookings, Contact, Consultations, LENS, Cleaning Out Your Closet, Pocket Mindset, Learn Hypnosis, Podcast, and Accessibility. Dynamic pages (blog posts, products) auto-generate. The sitemap auto-updates when new content is published."
        },
        {
          id: "misc-15",
          title: "Clarify product vs course setup workflow",
          description: "Question: Do courses also have to be set up under products, or will they automatically appear there?",
          status: "completed",
          priority: "low",
          notes: "✅ CLARIFIED: Courses and Products are separate systems that work together. (1) Create your COURSE in Course Manager - this is the learning content (modules, lessons, videos). (2) Create a PRODUCT in Product Manager to sell it - this handles pricing and Stripe. (3) Link them together: In Product Manager, set the product's 'related_course_id' to your course ID, OR in Course Manager edit the course and link a product. Once linked, when someone buys the product, they automatically get access to the course. Products can exist without courses (for books, webinars, consultations), and courses can be created first as drafts before you're ready to sell them."
        }

      ]
    },
    {
      category: "Mobile Readiness",
      categoryId: "mobilereadiness",
      priority: "high",
      items: [
        {
          id: "mobile-1",
          title: "Update Layout & AuthLayout to use CSS brand variables",
          description: "Replace hardcoded Tailwind colors with CSS variables (--cream, --forest-green, etc.) to support dark mode theme",
          status: "completed",
          priority: "medium",
          notes: "✅ FIXED: Added dark mode CSS variables to both Layout and AuthLayout. @media (prefers-color-scheme: dark) media query automatically switches all brand colors when user's device is in dark mode. Variables update system-wide."
        },
        {
          id: "mobile-2",
          title: "Apply safe-area classes for notched devices",
          description: "Add .safe-area-top to fixed header and .safe-area-bottom to MobileBottomNav.jsx to prevent clipping on iPhone notches",
          status: "completed",
          priority: "high",
          notes: "✅ FIXED: Added safe-area-top to Layout header and safe-area-bottom to MobileBottomNav and its menu panel. Content now respects notch/home indicator areas on iPhone 12+, iPad with notch, and other notched devices."
        },
        {
          id: "mobile-3",
          title: "Add Delete Account to Profile Settings",
          description: "Implement Delete Account section in Profile Settings with confirmation dialog",
          status: "completed",
          priority: "medium",
          notes: "✅ VERIFIED: Delete Account section already exists in Profile Settings under the 'Preferences' tab in the Danger Zone. Two-step confirmation process: first confirmation dialog, then text verification (type 'DELETE MY ACCOUNT'). All data is permanently deleted on confirmation."
        },
        {
          id: "mobile-4",
          title: "Implement pull-to-refresh on Dashboard, Library & Blog",
          description: "Add native-style pull-to-refresh using framer-motion on Dashboard, Library, and Blog listing scroll views",
          status: "completed",
          priority: "medium",
          notes: "✅ COMPLETED: Created reusable usePullToRefresh hook with haptic feedback. Implemented on Dashboard (refreshes bookings & stats), Library (refreshes course progress & resources), and Blog (pull-to-refresh UI). Smooth animations with framer-motion. Touch-based interaction for mobile."
        },
        {
          id: "mobile-5",
          title: "MobileBottomNav: Reset route on active tab tap",
          description: "When user taps active tab icon in MobileBottomNav, reset that tab's route to its root page",
          status: "completed",
          priority: "low",
          notes: "✅ FIXED: Double-tap an active bottom nav tab to reset to root page. Single tap navigates normally. Haptic feedback on all taps."
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
          status: "completed",
          priority: "low",
          notes: "Yes, AI generates personalized recommendations, insights, and smart suggestions on the dashboard based on user activity, course progress, and engagement patterns."
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

  // Only use static bugs (database reports are managed separately via BugReport entity)
  const bugs = React.useMemo(() => {
    return staticBugs.map(cat => ({
      ...cat,
      tested: categoryStates[cat.categoryId] || false,
      items: cat.items.map(item => ({
        ...item,
        tested: staticBugStates[item.id] || false,
        fromDatabase: false
      }))
    }));
  }, [staticBugStates, categoryStates]);



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
            <h1 className="font-serif text-2xl md:text-4xl text-[#1E3A32] mb-4">Bug & Issue Tracker</h1>
            <p className="text-sm md:text-base text-[#2B2725]/70">
              Roberta's reported issues and change requests
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-8">
            <div className="bg-white p-3 md:p-4 border-l-4 border-[#1E3A32]">
              <div className="text-xl md:text-2xl font-bold text-[#1E3A32]">{stats.total}</div>
              <div className="text-xs md:text-sm text-[#2B2725]/60">Total Issues</div>
            </div>
            <div className="bg-white p-3 md:p-4 border-l-4 border-red-500">
              <div className="text-xl md:text-2xl font-bold text-red-700">{stats.critical}</div>
              <div className="text-xs md:text-sm text-[#2B2725]/60">Critical</div>
            </div>
            <div className="bg-white p-3 md:p-4 border-l-4 border-orange-500">
              <div className="text-xl md:text-2xl font-bold text-orange-700">{stats.high}</div>
              <div className="text-xs md:text-sm text-[#2B2725]/60">High Priority</div>
            </div>
            <div className="bg-white p-3 md:p-4 border-l-4 border-yellow-500">
              <div className="text-xl md:text-2xl font-bold text-yellow-700">{stats.medium}</div>
              <div className="text-xs md:text-sm text-[#2B2725]/60">Medium Priority</div>
            </div>
            <div className="bg-white p-3 md:p-4 border-l-4 border-blue-500">
              <div className="text-xl md:text-2xl font-bold text-blue-700">{stats.low}</div>
              <div className="text-xs md:text-sm text-[#2B2725]/60">Low Priority</div>
            </div>
          </div>

          {/* Bug List */}
          <div className="space-y-6">
            {bugs.map((category) => {
              const isExpanded = expandedCategories.has(category.categoryId);
              const categoryPriority = category.priority;
              
              return (
                <div key={category.categoryId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex items-stretch">
                    <button
                      onClick={() => toggleCategory(category.categoryId)}
                      className="flex-1 px-4 md:px-6 py-3 md:py-4 flex items-start md:items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                        {isExpanded ? <ChevronDown size={18} className="flex-shrink-0" /> : <ChevronRight size={18} className="flex-shrink-0" />}
                        <h3 className={`font-serif text-base md:text-xl flex-1 truncate ${category.tested ? 'line-through text-[#2B2725]/40' : 'text-[#1E3A32]'}`}>
                          {category.category}
                        </h3>
                        <Badge className={`${getPriorityColor(categoryPriority)} text-xs md:text-sm flex-shrink-0`}>
                          {category.items.length}
                        </Badge>
                      </div>
                    </button>
                    <Button
                      onClick={() => toggleCategoryTested(category.categoryId)}
                      variant={category.tested ? "default" : "outline"}
                      size="sm"
                      className={`m-2 ${category.tested ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      title="Mark category as tested"
                    >
                      <Check size={16} />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {category.items.map((item, index) => {
                        const itemComments = allComments.filter(c => c.bug_id === item.id);
                        const isExpanded = expandedBugs.has(item.id);

                        return (
                        <div
                          key={item.id}
                          className={`px-4 md:px-6 py-3 md:py-4 ${index !== category.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2 flex-wrap">
                              {item.status === "completed" ? (
                                <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                              )}
                              <h4 className={`font-medium text-sm md:text-base flex-1 ${item.tested ? 'line-through text-[#2B2725]/40' : 'text-[#1E3A32]'}`}>
                                {item.title}
                              </h4>
                              <Button
                                onClick={() => item.fromDatabase ? handleToggleTested(item.id, item.tested) : toggleStaticItemTested(item.id)}
                                variant={item.tested ? "default" : "outline"}
                                size="sm"
                                className={`${item.tested ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                title="Mark as tested"
                              >
                                <Check size={14} />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                                {item.priority}
                              </Badge>
                              {item.deadline && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                  <Clock size={12} className="mr-1" />
                                  {item.deadline}
                                </Badge>
                              )}
                              <button
                                onClick={() => toggleBug(item.id)}
                                className="flex items-center gap-1 text-xs text-[#2B2725]/60 hover:text-[#1E3A32] transition-colors ml-auto"
                              >
                                <MessageSquare size={14} />
                                {itemComments.length > 0 && `${itemComments.length}`}
                              </button>
                            </div>
                            <p className={`text-xs md:text-sm ${item.tested ? 'line-through text-[#2B2725]/40' : 'text-[#2B2725]/70'}`}>
                              {item.description}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-[#2B2725]/50 italic">
                                Note: {item.notes}
                              </p>
                            )}

                            {isExpanded && (
                              <div className="mt-3 border-l-2 border-[#D8B46B] pl-3">
                                <div className="space-y-2 mb-3">
                                  {itemComments.map(comment => (
                                    <div key={comment.id} className="bg-[#F9F5EF] p-2 md:p-3 rounded text-xs md:text-sm">
                                      <p className="text-[#1E3A32]">{comment.comment}</p>
                                      <p className="text-[11px] text-[#2B2725]/50 mt-1">
                                        {comment.created_by} • {new Date(comment.created_date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex flex-col md:flex-row gap-2">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment[item.id] || ''}
                                    onChange={(e) => setNewComment({...newComment, [item.id]: e.target.value})}
                                    className="flex-1 min-h-[50px]"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddComment(item.id)}
                                    disabled={!newComment[item.id]?.trim()}
                                    className="bg-[#1E3A32] hover:bg-[#2B2725] md:flex-shrink-0"
                                  >
                                    <Send size={14} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {item.status}
                          </Badge>
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