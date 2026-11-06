import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Complaint, ComplaintStatus, AssignedTeam, ProblemSeverity } from '../types';
import { INITIAL_COMPLAINTS } from '../data/initialComplaints';
import { PROBLEM_TYPES } from '../data/problemTypes';

const STORAGE_KEY = 'tn_electrical_complaints_v2';
const LANG_STORAGE_KEY = 'tn_electrical_lang';

interface ComplaintContextType {
  complaints: Complaint[];
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  toggleLanguage: () => void;
  t: (en: string, ta: string) => string;
  addComplaint: (data: {
    consumerName: string;
    mobileNumber: string;
    district: string;
    talukVillage: string;
    addressLandmark: string;
    consumerNumber?: string;
    problemType: string;
    severity?: ProblemSeverity;
    description: string;
    attachmentUrl?: string;
  }) => Complaint;
  getComplaintById: (id: string) => Complaint | undefined;
  getComplaintsByMobile: (mobile: string) => Complaint[];
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    adminRemarks?: string,
    assignedTeam?: AssignedTeam
  ) => boolean;
  addFeedback: (id: string, rating: number, comment: string) => boolean;
  resetToDemoData: () => void;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    emergencyCount: number;
    districtCounts: Record<string, number>;
    problemCounts: Record<string, number>;
    resolvedRatePercent: number;
  };
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_COMPLAINTS;
  });

  const [language, setLanguageState] = useState<'en' | 'ta'>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'ta' || savedLang === 'en') return savedLang;
    } catch {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints to localStorage', e);
    }
  }, [complaints]);

  const setLanguage = (lang: 'en' | 'ta') => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const t = (en: string, ta: string) => {
    return language === 'ta' ? ta : en;
  };

  // Helper to generate unique complaint ID
  const generateComplaintId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `TN-ELEC-${year}-${randomNum}`;
  };

  const addComplaint = (data: {
    consumerName: string;
    mobileNumber: string;
    district: string;
    talukVillage: string;
    addressLandmark: string;
    consumerNumber?: string;
    problemType: string;
    severity?: ProblemSeverity;
    description: string;
    attachmentUrl?: string;
  }): Complaint => {
    const problemDef = PROBLEM_TYPES.find((p) => p.name === data.problemType);
    const slaHours = problemDef?.standardSlaHours || 6;
    const severity = data.severity || problemDef?.defaultSeverity || 'High';

    const now = new Date();
    const estTime = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestampFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newId = generateComplaintId();

    const priority: 'Normal' | 'Urgent' | 'Critical' =
      severity === 'Emergency' ? 'Critical' : severity === 'High' ? 'Urgent' : 'Normal';

    const newComplaint: Complaint = {
      id: newId,
      consumerName: data.consumerName.trim(),
      mobileNumber: data.mobileNumber.trim(),
      district: data.district,
      talukVillage: data.talukVillage.trim(),
      addressLandmark: data.addressLandmark.trim(),
      consumerNumber: data.consumerNumber?.trim() || undefined,
      problemType: data.problemType,
      severity,
      description: data.description.trim(),
      status: 'Submitted',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      estimatedResolutionTime: estTime.toISOString(),
      priority,
      attachmentUrl: data.attachmentUrl,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          title: 'Complaint Registered',
          timestamp: timestampFormatted,
          note: `New grievance ticket generated. Assigned priority: ${priority}. Automated dispatch notification queued to ${data.district} circle office.`,
          status: 'Submitted',
          actor: 'Citizen Portal',
        },
      ],
      isDemo: false,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const getComplaintById = (id: string): Complaint | undefined => {
    const clean = id.trim().toUpperCase();
    return complaints.find(
      (c) => c.id.toUpperCase() === clean || c.id.toUpperCase().replace(/[^0-9]/g, '') === clean
    );
  };

  const getComplaintsByMobile = (mobile: string): Complaint[] => {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    return complaints.filter((c) => c.mobileNumber.replace(/[^0-9]/g, '').includes(cleanMobile));
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    adminRemarks?: string,
    assignedTeam?: AssignedTeam
  ): boolean => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestampFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let found = false;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          found = true;
          const statusNotes: Record<ComplaintStatus, string> = {
            Submitted: 'Status marked back to Submitted for re-evaluation.',
            Assigned: assignedTeam
              ? `Assigned to ${assignedTeam.name} (${assignedTeam.designation}), Contact: ${assignedTeam.phone}`
              : 'Assigned to Area Substation Field Gang.',
            'In Progress': adminRemarks || 'Work in progress. Line crew mobilized on site with repair equipment.',
            Resolved: adminRemarks || 'Fault rectified, power supply restored and confirmed normal.',
            Rejected: adminRemarks || 'Ticket closed or merged due to invalid details / duplicate report.',
          };

          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Status: ${newStatus}`,
            timestamp: timestampFormatted,
            note: adminRemarks || statusNotes[newStatus] || `Status updated to ${newStatus}`,
            status: newStatus,
            actor: 'System Admin / Area Engineer',
          };

          return {
            ...c,
            status: newStatus,
            updatedAt: now.toISOString(),
            adminRemarks: adminRemarks || c.adminRemarks,
            assignedTeam: assignedTeam || c.assignedTeam,
            timeline: [...c.timeline, newTimelineItem],
          };
        }
        return c;
      })
    );

    return found;
  };

  const addFeedback = (id: string, rating: number, comment: string): boolean => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestampFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let found = false;
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          found = true;
          return {
            ...c,
            feedback: {
              rating,
              comment,
              submittedAt: timestampFormatted,
            },
          };
        }
        return c;
      })
    );
    return found;
  };

  const resetToDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    } catch {
      // ignore
    }
  };

  // Compute live statistics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Assigned').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const emergencyCount = complaints.filter((c) => c.severity === 'Emergency' && c.status !== 'Resolved').length;

  const districtCounts: Record<string, number> = {};
  const problemCounts: Record<string, number> = {};

  complaints.forEach((c) => {
    districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    problemCounts[c.problemType] = (problemCounts[c.problemType] || 0) + 1;
  });

  const resolvedRatePercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        language,
        setLanguage,
        toggleLanguage,
        t,
        addComplaint,
        getComplaintById,
        getComplaintsByMobile,
        updateComplaintStatus,
        addFeedback,
        resetToDemoData,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          emergencyCount,
          districtCounts,
          problemCounts,
          resolvedRatePercent,
        },
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
