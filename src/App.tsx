import React, { useState } from 'react';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { Home } from './pages/Home';
import { ReportComplaint } from './pages/ReportComplaint';
import { TrackComplaint } from './pages/TrackComplaint';
import { DistrictDashboard } from './pages/DistrictDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutUs } from './pages/AboutUs';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [prefilledProblemType, setPrefilledProblemType] = useState<string | undefined>(undefined);
  const [prefilledDistrict, setPrefilledDistrict] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string, params?: { problemType?: string; district?: string }) => {
    if (params?.problemType) {
      setPrefilledProblemType(params.problemType);
    }
    if (params?.district) {
      setPrefilledDistrict(params.district);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackIdSubmit = (id: string) => {
    setSelectedTrackId(id);
    setCurrentPage('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ComplaintProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-yellow-400 selection:text-slate-950">
        {/* Top interactive Demo notification */}
        <DemoBanner
          onSelectTrackId={(id) => handleTrackIdSubmit(id)}
          onNavigate={(page) => handleNavigate(page)}
        />

        {/* Global Navigation Bar */}
        <Navbar currentPage={currentPage} onNavigate={(p) => handleNavigate(p)} />

        {/* Main Page Content */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <Home
              onNavigate={(p, params) => handleNavigate(p, params)}
              onTrackIdSubmit={handleTrackIdSubmit}
            />
          )}

          {currentPage === 'report' && (
            <ReportComplaint
              initialProblemType={prefilledProblemType}
              initialDistrict={prefilledDistrict}
              onNavigateToTrack={(id) => handleTrackIdSubmit(id)}
            />
          )}

          {currentPage === 'track' && (
            <TrackComplaint
              initialSearchId={selectedTrackId}
              onNavigateToReport={() => handleNavigate('report')}
            />
          )}

          {currentPage === 'districts' && (
            <DistrictDashboard
              initialDistrict={prefilledDistrict}
              onNavigateToTrack={(id) => handleTrackIdSubmit(id)}
              onNavigateToReport={(dist) => handleNavigate('report', { district: dist })}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboard
              onNavigateToTrack={(id) => handleTrackIdSubmit(id)}
              onNavigateToReport={() => handleNavigate('report')}
            />
          )}

          {currentPage === 'about' && <AboutUs />}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={(p) => handleNavigate(p)} />
      </div>
    </ComplaintProvider>
  );
}
