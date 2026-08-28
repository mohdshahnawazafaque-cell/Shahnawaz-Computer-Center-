import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { SarkariToolsModal } from './components/SarkariToolsModal';
import { PushNotificationPrompt } from './components/PushNotificationPrompt';
import { AIChatWidget } from './components/AIChatWidget';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PrintServicesPage } from './pages/PrintServicesPage';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CyberCafeHubPage } from './pages/CyberCafeHubPage';
import { CyberCafeAppBuilderPage } from './pages/CyberCafeAppBuilderPage';
import { CyberCafeToolViewerPage } from './pages/CyberCafeToolViewerPage';
import { PostType } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [toolsModalOpen, setToolsModalOpen] = useState(false);
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [toolsInitialTab, setToolsInitialTab] = useState<'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter'>('salary');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string, _type: PostType) => {
    navigate(`/post/${slug}`);
  };

  const handleOpenTools = (tab: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter' = 'salary') => {
    setToolsInitialTab(tab);
    setToolsModalOpen(true);
  };

  // Route matching logic
  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenTools={handleOpenTools}
        />
      );
    }

    if (
      currentPath.startsWith('/post/') ||
      currentPath.startsWith('/sarkari-yojana/')
    ) {
      const parts = currentPath.split('/');
      const slug = parts[parts.length - 1] || '';
      return (
        <PostDetailPage
          slug={slug}
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
        />
      );
    }

    if (currentPath === '/sarkari-yojana' || currentPath === '/yojana') {
      return (
        <CategoryPage
          categorySlug="sarkari-yojana"
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
        />
      );
    }

    if (currentPath.startsWith('/category/')) {
      const categorySlug = currentPath.replace('/category/', '');
      return (
        <CategoryPage
          categorySlug={categorySlug}
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
        />
      );
    }

    if (currentPath === '/print-services') {
      return <PrintServicesPage onNavigate={navigate} />;
    }
    if (currentPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    
    

    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin') {
      return (
        <AdminDashboardPage
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
        />
      );
    }

    if (currentPath.startsWith('/workspace/tool/')) {
      return <CyberCafeToolViewerPage onNavigate={navigate} currentPath={currentPath} />;
    }

    if (currentPath === '/workspace') {
      return <CyberCafeHubPage onNavigate={navigate} currentPath={currentPath} />;
    }

    if (currentPath.startsWith('/workspace/application/')) {
      return <CyberCafeAppBuilderPage onNavigate={navigate} currentPath={currentPath} />;
    }

    // Fallback to Home
    return (
      <HomePage
        onNavigate={navigate}
        onSelectPost={handleSelectPost}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenTools={handleOpenTools}
      />
    );
  };

  const isAdminView = currentPath === '/admin';



  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <div id="shahnawaz-computer-center-app" className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-red-600 selection:text-white transition-colors duration-200">
          {/* Offline Banner Indicator */}
          <OfflineIndicator />

          {/* Main Global Header */}
          <Header
            currentPath={currentPath}
            onNavigate={navigate}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenTools={handleOpenTools}
            onOpenPushModal={() => setPushModalOpen(true)}
          />

          {/* Breaking News / Announcements Marquee */}
          {!isAdminView && <AnnouncementBar onNavigate={navigate} />}

          {/* Active View Container with Error Boundary Safeguard */}
          <main id="main-view-container" className="flex-1">
            <ErrorBoundary
              resetKey={currentPath}
              onReset={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {renderCurrentView()}
            </ErrorBoundary>
          </main>

          {/* Main Global Footer */}
          {!isAdminView && <Footer onNavigate={navigate} />}

          {/* Fast Global Search Modal */}
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onSelectPost={handleSelectPost}
          />

          {/* Sarkari Online Utility Tools Modal (Photo Resizer, Age Calculator, Resume Maker) */}
          <SarkariToolsModal
            isOpen={toolsModalOpen}
            onClose={() => setToolsModalOpen(false)}
            initialTab={toolsInitialTab}
          />

          {/* Instant Web Push Notifications Opt-In & Preferences Modal */}
          <PushNotificationPrompt
            isOpen={pushModalOpen}
            onClose={() => setPushModalOpen(false)}
          />

          {/* Floating AI Chat Assistant */}
          <AIChatWidget />
          </div>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
