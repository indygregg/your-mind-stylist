import Home from './pages/Home';
import About from './pages/About';
import WorkWithMe from './pages/WorkWithMe';
import Certification from './pages/Certification';
import PrivateSessions from './pages/PrivateSessions';
import InnerRehearsal from './pages/InnerRehearsal';
import SpeakingTraining from './pages/SpeakingTraining';
import FreeMasterclass from './pages/FreeMasterclass';
import Podcast from './pages/Podcast';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import BlogPost from './pages/BlogPost';
import ManagerDashboard from './pages/ManagerDashboard';
import BlogManager from './pages/BlogManager';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoadmap from './pages/AdminRoadmap';
import AdminUsers from './pages/AdminUsers';
import StudioDashboard from './pages/StudioDashboard';
import StudioDevDocs from './pages/StudioDevDocs';
import StudioRoles from './pages/StudioRoles';
import StudioLegal from './pages/StudioLegal';
import StudioSettings from './pages/StudioSettings';
import StudioLogs from './pages/StudioLogs';
import NotFound from './pages/NotFound';
import LegalPage from './pages/LegalPage';
import StudioLegalEditor from './pages/StudioLegalEditor';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "About": About,
    "WorkWithMe": WorkWithMe,
    "Certification": Certification,
    "PrivateSessions": PrivateSessions,
    "InnerRehearsal": InnerRehearsal,
    "SpeakingTraining": SpeakingTraining,
    "FreeMasterclass": FreeMasterclass,
    "Podcast": Podcast,
    "Blog": Blog,
    "Contact": Contact,
    "Dashboard": Dashboard,
    "BlogPost": BlogPost,
    "ManagerDashboard": ManagerDashboard,
    "BlogManager": BlogManager,
    "AdminDashboard": AdminDashboard,
    "AdminRoadmap": AdminRoadmap,
    "AdminUsers": AdminUsers,
    "StudioDashboard": StudioDashboard,
    "StudioDevDocs": StudioDevDocs,
    "StudioRoles": StudioRoles,
    "StudioLegal": StudioLegal,
    "StudioSettings": StudioSettings,
    "StudioLogs": StudioLogs,
    "NotFound": NotFound,
    "LegalPage": LegalPage,
    "StudioLegalEditor": StudioLegalEditor,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};