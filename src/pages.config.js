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
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};