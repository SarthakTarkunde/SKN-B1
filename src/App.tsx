import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrendingSection } from './components/TrendingSection';
import { FacultyList } from './components/FacultyList';
import { ReviewFeed } from './components/ReviewFeed';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { FacultyDetailModal } from './components/FacultyDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';

export const MainContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero />
        <TrendingSection />
        <FacultyList />
        <ReviewFeed />
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <FacultyDetailModal />
      <ReviewModal />
      <ReportModal />
      <AdminDashboard />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
