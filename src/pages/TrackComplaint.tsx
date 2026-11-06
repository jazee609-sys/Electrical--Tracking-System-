import React, { useState, useEffect } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import { TAMIL_NADU_DISTRICTS } from '../data/districts';
import { Complaint, ComplaintStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  AlertOctagon,
  Phone,
  UserCheck,
  Building,
  Printer,
  Star,
  Send,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  PhoneForwarded,
} from 'lucide-react';

interface TrackComplaintProps {
  initialSearchId?: string;
  onNavigateToReport: () => void;
}

export const TrackComplaint: React.FC<TrackComplaintProps> = ({
  initialSearchId,
  onNavigateToReport,
}) => {
  const { complaints, getComplaintById, getComplaintsByMobile, addFeedback, t } = useComplaints();

  const [searchInput, setSearchInput] = useState(initialSearchId || '');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [matchingList, setMatchingList] = useState<Complaint[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Escalation simulator state
  const [escalated, setEscalated] = useState(false);
  const [escalationToast, setEscalationToast] = useState<string | null>(null);

  // Execute search if initial ID passed
  useEffect(() => {
    if (initialSearchId) {
      setSearchInput(initialSearchId);
      performSearch(initialSearchId);
    }
  }, [initialSearchId]);

  const performSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHasSearched(true);
    setEscalated(false);
    setFeedbackSubmitted(false);

    // Try finding by ID
    const byId = getComplaintById(trimmed);
    if (byId) {
      setSelectedComplaint(byId);
      setMatchingList([]);
      return;
    }

    // Try finding by mobile
    const byMobile = getComplaintsByMobile(trimmed);
    if (byMobile.length === 1) {
      setSelectedComplaint(byMobile[0]);
      setMatchingList([]);
    } else if (byMobile.length > 1) {
      setSelectedComplaint(null);
      setMatchingList(byMobile);
    } else {
      setSelectedComplaint(null);
      setMatchingList([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleQuickSelect = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setSearchInput(complaint.id);
    setMatchingList([]);
    setHasSearched(true);
    setEscalated(false);
    setFeedbackSubmitted(false);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    addFeedback(selectedComplaint.id, feedbackRating, feedbackComment);
    setFeedbackSubmitted(true);
  };

  const handleEscalate = () => {
    setEscalated(true);
    setEscalationToast(
      'Urgent reminder and escalation SMS dispatched to Area Assistant Executive Engineer!'
    );
    setTimeout(() => setEscalationToast(null), 4000);
  };

  // Stepper helper
  const getStepStatus = (
    currentStatus: ComplaintStatus,
    targetStep: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved'
  ) => {
    const hierarchy: Record<ComplaintStatus, number> = {
      Submitted: 1,
      Assigned: 2,
      'In Progress': 3,
      Resolved: 4,
      Rejected: 0,
    };

    const targetHierarchy: Record<string, number> = {
      Submitted: 1,
      Assigned: 2,
      'In Progress': 3,
      Resolved: 4,
    };

    const currentLevel = hierarchy[currentStatus] || 1;
    const targetLevel = targetHierarchy[targetStep];

    if (currentStatus === 'Rejected') {
      return 'rejected';
    }

    if (currentLevel > targetLevel) return 'completed';
    if (currentLevel === targetLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          <Search className="w-3.5 h-3.5 text-yellow-500" />
          <span>{t('Grievance Tracking Portal', 'புகார் நிலையை அறிதல்')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {t('Track Complaint Status', 'மின்சார புகார் நிலவரம்')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t(
            'Enter your unique Complaint ID (e.g. TN-ELEC-2026-80412) or registered 10-digit mobile number to view live restoration progress.',
            'உங்கள் புகார் எண் அல்லது பதிவு செய்த அலைபேசி எண்ணை உள்ளிட்டு நிலையை அறியலாம்.'
          )}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t(
                'Enter Complaint ID (e.g., TN-ELEC-2026-80412) or Mobile Number',
                'புகார் எண் அல்லது 10 இலக்க அலைபேசி எண்'
              )}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-7 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{t('Search Status', 'நிலையை தேடுக')}</span>
          </button>
        </form>

        {/* Quick Demo Samples for Testing */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('Try Sample Tickets:', 'மாதிரி புகார்களை சோதிக்க:')}
          </span>
          {complaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => handleQuickSelect(c)}
              className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 px-2.5 py-1 rounded-md transition-colors font-mono cursor-pointer flex items-center gap-1.5 border border-slate-200"
            >
              <span>{c.id}</span>
              <span className="text-[10px] text-slate-500">({c.district})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Multiple mobile matches list */}
      {matchingList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            {t(
              `Found ${matchingList.length} complaints for this mobile number. Please select one:`,
              `இந்த அலைபேசி எண்ணில் ${matchingList.length} புகார்கள் உள்ளன. ஒன்றை தேர்ந்தெடுக்கவும்:`
            )}
          </h3>
          <div className="divide-y divide-slate-100">
            {matchingList.map((c) => (
              <div
                key={c.id}
                onClick={() => handleQuickSelect(c)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {c.problemType} • {c.district} ({c.talukVillage})
                  </p>
                </div>
                <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  View Timeline <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Found Screen */}
      {hasSearched && !selectedComplaint && matchingList.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('No Complaint Found', 'புகார் எதுவும் கிடைக்கவில்லை')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
              {t(
                `We could not find any grievance matching "${searchInput}". Please verify the complaint ID or mobile number.`,
                `"${searchInput}" என்ற விவரத்திற்கு ஏற்ப புகார் எதுவும் இல்லை. சரியான எண்ணை உள்ளிடவும்.`
              )}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onNavigateToReport}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              {t('Register New Complaint', 'புதிய புகார் பதிவு')}
            </button>
            <button
              onClick={() => handleQuickSelect(complaints[0])}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              {t('Load Sample Ticket', 'மாதிரி புகார் பார்க்க')}
            </button>
          </div>
        </div>
      )}

      {/* Selected Complaint Tracking Details */}
      {selectedComplaint && (
        <div className="space-y-6">
          {/* Stepper Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ticket ID: <span className="font-mono text-blue-900 font-black">{selectedComplaint.id}</span>
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.problemType}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedComplaint.status} size="lg" />
                <SeverityBadge severity={selectedComplaint.severity} />
              </div>
            </div>

            {/* Visual 4-Step Progress Bar */}
            <div className="py-8">
              <div className="grid grid-cols-4 gap-2 relative">
                {/* Connecting track line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 z-0 hidden sm:block" />

                {/* Step 1: Submitted */}
                {(() => {
                  const state = getStepStatus(selectedComplaint.status, 'Submitted');
                  return (
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                          state === 'completed' || state === 'current'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">1. Submitted</span>
                      <span className="text-[10px] text-slate-500 hidden sm:block">Ticket Created</span>
                    </div>
                  );
                })()}

                {/* Step 2: Assigned */}
                {(() => {
                  const state = getStepStatus(selectedComplaint.status, 'Assigned');
                  return (
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : state === 'current'
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">2. Assigned</span>
                      <span className="text-[10px] text-slate-500 hidden sm:block">To Substation Gang</span>
                    </div>
                  );
                })()}

                {/* Step 3: In Progress */}
                {(() => {
                  const state = getStepStatus(selectedComplaint.status, 'In Progress');
                  return (
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : state === 'current'
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">3. Field Work</span>
                      <span className="text-[10px] text-slate-500 hidden sm:block">Repair In Progress</span>
                    </div>
                  );
                })()}

                {/* Step 4: Resolved */}
                {(() => {
                  const state = getStepStatus(selectedComplaint.status, 'Resolved');
                  return (
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                          state === 'completed' || state === 'current'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">4. Restored</span>
                      <span className="text-[10px] text-slate-500 hidden sm:block">Power Charged</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Official Admin Note Alert if available */}
            {selectedComplaint.adminRemarks && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded-r-lg text-xs sm:text-sm">
                <span className="font-bold text-blue-950 block mb-0.5">
                  {t('Official Section Office Dispatch Note:', 'உதவி பொறியாளர் குறிப்பு:')}
                </span>
                <p className="text-blue-900">{selectedComplaint.adminRemarks}</p>
              </div>
            )}
          </div>

          {/* Assigned Crew Card & Action Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field Team Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>{t('Assigned Substation / Line Crew', 'ஒதுக்கப்பட்ட களப்பணியாளர்')}</span>
              </h3>

              {selectedComplaint.assignedTeam ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-base">
                        {selectedComplaint.assignedTeam.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedComplaint.assignedTeam.designation}
                      </p>
                      <p className="text-xs text-blue-700 font-medium mt-1">
                        {selectedComplaint.assignedTeam.substation}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedComplaint.assignedTeam.sectionOffice}
                      </p>
                    </div>

                    <a
                      href={`tel:${selectedComplaint.assignedTeam.phone}`}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl flex items-center gap-2 text-xs shadow-md transition-colors shrink-0"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span>Call Lineman</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>Contact Number:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedComplaint.assignedTeam.phone}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-500">
                  <p>Ticket is in automated dispatch queue.</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    Routing to {selectedComplaint.district} local circle office.
                  </p>
                </div>
              )}
            </div>

            {/* Location & Ticket Metadata */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{t('Incident Location & Details', 'சம்பவ இடம் & விவரம்')}</span>
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('District:', 'மாவட்டம்:')}</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Area / Village:', 'கிராமம் / பகுதி:')}</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.talukVillage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Landmark:', 'அடையாளம்:')}</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                    {selectedComplaint.addressLandmark}
                  </span>
                </div>
                {selectedComplaint.consumerNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('EB Consumer No:', 'மின் இணைப்பு:')}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedComplaint.consumerNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Registered Mobile:', 'அலைபேசி:')}</span>
                  <span className="font-mono text-slate-800">{selectedComplaint.mobileNumber}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-2">
                {selectedComplaint.status !== 'Resolved' && (
                  <button
                    onClick={handleEscalate}
                    disabled={escalated}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      escalated
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{escalated ? 'Reminder Sent to AEE' : 'Escalate Delay / Send Alert'}</span>
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>

              {escalationToast && (
                <div className="text-xs bg-slate-900 text-yellow-300 p-2 rounded text-center animate-fade-in font-medium">
                  {escalationToast}
                </div>
              )}
            </div>
          </div>

          {/* Chronological Timeline History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{t('Grievance Action Timeline & History', 'நடவடிக்கை வரலாறு')}</span>
            </h3>

            <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-3">
              {selectedComplaint.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative pl-6 pb-2">
                  <div className="absolute -left-[1.95rem] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="text-slate-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.note}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Actor: {item.actor}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Form if Resolved */}
          {selectedComplaint.status === 'Resolved' && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-base">
                    {t('Power Restored & Fault Rectified', 'மின்சாரம் மீட்டெடுக்கப்பட்டது!')}
                  </h3>
                  <p className="text-xs text-emerald-700">
                    {t(
                      'Please share your satisfaction feedback to help improve TNEB district response times.',
                      'உங்கள் திருப்தி மதிப்பீட்டை பதிவு செய்து சேவை தரத்தை உயர்த்த உதவுங்கள்.'
                    )}
                  </p>
                </div>
              </div>

              {selectedComplaint.feedback || feedbackSubmitted ? (
                <div className="bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (selectedComplaint.feedback?.rating || feedbackRating)
                            ? 'fill-current text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {selectedComplaint.feedback?.rating || feedbackRating} / 5 Stars
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 italic">
                    "{selectedComplaint.feedback?.comment || feedbackComment || 'Great service restored on time!'}"
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ✓ Feedback recorded in Chief Engineer Quality Audit log.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Rate Lineman & Restoration:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= feedbackRating
                                ? 'fill-current text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share your feedback (e.g. Lineman was polite and restored power within 30 mins)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Citizen Feedback</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
