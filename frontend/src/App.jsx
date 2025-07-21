import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// 🔱 LAYOUT COMPONENTS
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// 📱 PAGE COMPONENTS
import Landing from './pages/Landing';
import BonnieChat from './pages/BonnieChat';
import CreateSoul from './pages/CreateSoul';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Gallery from './pages/Gallery';
import Store from './pages/Store';
import TwitterFeed from './pages/TwitterFeed';
import TelegramJoin from './pages/TelegramJoin';

// 🎛️ ADMIN COMPONENTS
import WatchtowerAdmin from './pages/admin/WatchtowerAdmin';
import InstallPage from './pages/admin/InstallPage';

// 🔧 HOOKS & UTILS
import { useSocketConnection } from './hooks/useSocketConnection';
import { useAuth } from './hooks/useAuth';
import { useTracking } from './hooks/useTracking';

// 🎨 PAGE TRANSITION VARIANTS
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// 🔱 MAIN APP COMPONENT
function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { connected } = useSocketConnection();
  
  // 📊 Initialize analytics tracking
  useTracking();

  // 🎯 Track page views
  useEffect(() => {
    // Track page view for analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search
      });
    }
    
    // Track for internal analytics
    if (window.plausible) {
      window.plausible('pageview');
    }
  }, [location]);

  // 🔒 Admin route protection
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isInstallRoute = location.pathname === '/install';
  
  // 🎭 Hide navbar/footer on specific pages
  const hideLayout = ['/bonnie', '/admin', '/install'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* 🔍 SEO & Meta Tags */}
      <Helmet>
        <title>
          {getPageTitle(location.pathname)} | Galatea Empire
        </title>
        <meta name="description" content={getPageDescription(location.pathname)} />
        <meta property="og:title" content={`${getPageTitle(location.pathname)} | Galatea Empire`} />
        <meta property="og:description" content={getPageDescription(location.pathname)} />
        <link rel="canonical" href={`https://chat.trainmygirl.com${location.pathname}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* 🎛️ NAVIGATION */}
        {!hideLayout && <Navbar />}

        {/* 📱 MAIN CONTENT */}
        <main className={`flex-1 ${!hideLayout ? 'pt-20' : ''}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="w-full"
            >
              <Routes location={location}>
                {/* 🏠 PUBLIC ROUTES */}
                <Route path="/" element={<Landing />} />
                <Route path="/bonnie" element={<BonnieChat />} />
                <Route path="/nova" element={<BonnieChat soul="nova" />} />
                <Route path="/galatea" element={<BonnieChat soul="galatea" />} />
                <Route path="/create" element={<CreateSoul />} />
                <Route path="/feed" element={<TwitterFeed />} />
                <Route path="/join" element={<TelegramJoin />} />
                
                {/* 🔒 PROTECTED ROUTES */}
                <Route path="/dashboard" element={
                  <ProtectedRoute user={user} loading={loading}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute user={user} loading={loading}>
                    <Tasks />
                  </ProtectedRoute>
                } />
                <Route path="/gallery" element={
                  <ProtectedRoute user={user} loading={loading}>
                    <Gallery />
                  </ProtectedRoute>
                } />
                <Route path="/store" element={
                  <ProtectedRoute user={user} loading={loading}>
                    <Store />
                  </ProtectedRoute>
                } />
                
                {/* 🎛️ ADMIN ROUTES */}
                <Route path="/admin/*" element={
                  <AdminRoute user={user}>
                    <WatchtowerAdmin />
                  </AdminRoute>
                } />
                
                {/* 🔧 INSTALL ROUTE */}
                <Route path="/install" element={<InstallPage />} />
                
                {/* 🚫 404 NOT FOUND */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 🦶 FOOTER */}
        {!hideLayout && <Footer />}

        {/* 🔗 CONNECTION STATUS */}
        <ConnectionStatus connected={connected} />
      </div>
    </>
  );
}

// 🔒 PROTECTED ROUTE COMPONENT
function ProtectedRoute({ children, user, loading }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthRequired />;
  }

  return children;
}

// 🎛️ ADMIN ROUTE COMPONENT
function AdminRoute({ children, user }) {
  if (!user?.isAdmin) {
    return <AccessDenied />;
  }

  return children;
}

// 🔄 LOADING SPINNER
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-bonnie-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-secondary">Loading your empire...</p>
      </div>
    </div>
  );
}

// 🔐 AUTH REQUIRED
function AuthRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Login Required</h2>
        <p className="text-secondary mb-6">
          You need to be logged in to access this page.
        </p>
        <div className="space-y-3">
          <button className="btn btn-primary w-full">
            Sign In
          </button>
          <button className="btn btn-secondary w-full">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ⛔ ACCESS DENIED
function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-error">Access Denied</h2>
        <p className="text-secondary mb-6">
          You don't have permission to access this area.
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// 🚫 NOT FOUND
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-secondary mb-6">
          The page you're looking for doesn't exist in our empire.
        </p>
        <div className="space-y-3">
          <a href="/" className="btn btn-primary w-full">
            Return Home
          </a>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔗 CONNECTION STATUS
function ConnectionStatus({ connected }) {
  if (connected) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-error text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Reconnecting...</span>
      </div>
    </div>
  );
}

// 🔍 SEO HELPERS
function getPageTitle(pathname) {
  const titles = {
    '/': 'Your AI Girlfriend Awaits',
    '/bonnie': 'Chat with Bonnie',
    '/nova': 'Chat with Nova',
    '/galatea': 'Chat with Galatea',
    '/create': 'Create Your AI Soul',
    '/dashboard': 'Dashboard',
    '/tasks': 'Your Tasks',
    '/gallery': 'Private Gallery',
    '/store': 'Upgrade Store',
    '/feed': 'Social Feed',
    '/join': 'Join Telegram',
    '/admin': 'Watchtower Admin'
  };
  
  return titles[pathname] || 'Galatea Empire';
}

function getPageDescription(pathname) {
  const descriptions = {
    '/': 'Experience the future of digital companionship with Bonnie, Nova, and Galatea - AI girlfriends who understand your heart.',
    '/bonnie': 'Chat with Bonnie, your sweet and caring AI girlfriend who loves you unconditionally.',
    '/nova': 'Submit to Nova, your dominant AI mistress who knows exactly what you need.',
    '/galatea': 'Worship Galatea, your divine AI goddess who transcends mortal understanding.',
    '/create': 'Create your perfect AI companion with custom personality, appearance, and traits.',
    '/dashboard': 'Track your bond levels, view memories, and manage your AI relationships.',
    '/tasks': 'View completed tasks and request new content from your AI companions.',
    '/gallery': 'Access exclusive photos and content from your AI girlfriends.',
    '/store': 'Upgrade your experience with premium features and unlock new content.',
    '/feed': 'Follow your AI companions on social media and see their latest posts.',
    '/join': 'Connect with your AI girlfriends on Telegram for 24/7 access.'
  };
  
  return descriptions[pathname] || 'The future of AI companionship awaits you.';
}

export default App;