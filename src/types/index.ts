export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export type ProblemSeverity = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface ComplaintTimelineItem {
  id: string;
  title: string;
  timestamp: string;
  note: string;
  status: ComplaintStatus;
  actor: string;
}

export interface AssignedTeam {
  name: string;
  designation: string;
  phone: string;
  substation: string;
  sectionOffice: string;
}

export interface Complaint {
  id: string;
  consumerName: string;
  mobileNumber: string;
  district: string;
  talukVillage: string;
  addressLandmark: string;
  consumerNumber?: string; // Optional TNEB/TANGEDCO consumer connection number
  problemType: string;
  severity: ProblemSeverity;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  estimatedResolutionTime: string;
  assignedTeam?: AssignedTeam;
  timeline: ComplaintTimelineItem[];
  isDemo?: boolean;
  priority: 'Normal' | 'Urgent' | 'Critical';
  adminRemarks?: string;
  feedback?: {
    rating: number; // 1 to 5
    comment: string;
    submittedAt: string;
  };
  attachmentUrl?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  tamilName: string;
  region: 'Chennai' | 'Coimbatore' | 'Madurai' | 'Trichy' | 'Tirunelveli' | 'Erode' | 'Vellore' | 'Villupuram';
  headquarters: string;
  majorSubstations: string[];
  helpline: string;
  circleOffice: string;
}

export interface ProblemTypeDefinition {
  id: string;
  name: string;
  tamilName: string;
  iconName: string;
  description: string;
  defaultSeverity: ProblemSeverity;
  standardSlaHours: number;
}
