import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Sparkles, RotateCcw, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface DemoBannerProps {
  onSelectTrackId?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onSelectTrackId, onNavigate }) => {
  const { resetToDemoData, complaints } = useComplaints();
  const [dismissed, setDismissed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (dismissed) {
    return (
      <div className="bg-amber-100/80 border-b border-amber-200 py-1 px-4 text-xs flex justify-between items-center text-amber-900">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          Demo mode active with sample Tamil Nadu district complaints.
        </span>
        <button
          onClick={() => setDismissed(false)}
          className="text-xs text-amber-800 hover:text-amber-950 underline font-semibold cursor-pointer"
        >
          Show Demo Controls
        </button>
      </div>
    );
  }

  const handleReset = () => {
    resetToDemoData();
    setToastMessage('Demo dataset restored with sample complaints across Tamil Nadu!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickTrack = () => {
    const demoId = 'TN-ELEC-2026-80412';
    if (onSelectTrackId) {
      onSelectTrackId(demoId);
    }
    if (onNavigate) {
      onNavigate('track');
    }
  };

  const handleQuickAdmin = () => {
    if (onNavigate) {
      onNavigate('admin');
    }
  };

  return (
    <aside aria-label="Demo Mode Notification" className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-900 px-4 py-2.5 shadow-sm border-b border-amber-600/20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-yellow-300 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Demo Mode Active
          </span>
          <span className="font-medium text-slate-900">
            Pre-loaded with sample complaints ({complaints.length} tickets across Chennai, Madurai, Coimbatore, Salem, etc.)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleQuickTrack}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1 rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer text-xs"
          >
            <span>Test Track Ticket</span>
            <span className="font-mono text-yellow-300 font-bold">#80412</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            onClick={handleQuickAdmin}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-3 py-1 rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
            <span>Open Admin Dashboard</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset data to initial demo state"
            className="bg-white/80 hover:bg-white text-slate-800 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium cursor-pointer text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Minimize demo banner"
            className="text-slate-800 hover:text-slate-950 p-1 hover:bg-black/10 rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded shadow-lg text-xs z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </aside>
  );
};
