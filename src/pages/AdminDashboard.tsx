import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { TAMIL_NADU_DISTRICTS } from '../data/districts';
import { PROBLEM_TYPES } from '../data/problemTypes';
import { Complaint, ComplaintStatus, AssignedTeam } from '../types';
import { StatCard, HorizontalBarChart, DonutChart } from '../components/Charts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  AlertOctagon,
  Edit,
  Download,
  RotateCcw,
  Plus,
  X,
  Phone,
  UserCheck,
  Building,
  Save,
  Zap,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToTrack: (id: string) => void;
  onNavigateToReport: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToTrack,
  onNavigateToReport,
}) => {
  const { complaints, stats, updateComplaintStatus, resetToDemoData, t } = useComplaints();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [problemFilter, setProblemFilter] = useState<string>('All');

  // Status update modal
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [linemanName, setLinemanName] = useState('');
  const [linemanPhone, setLinemanPhone] = useState('');
  const [linemanDesignation, setLinemanDesignation] = useState('Line Inspector');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    // Search query matches ID, consumer name, mobile, taluk, or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.id.toLowerCase().includes(q) ||
        c.consumerName.toLowerCase().includes(q) ||
        c.mobileNumber.includes(q) ||
        c.talukVillage.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (districtFilter !== 'All' && c.district !== districtFilter) return false;
    if (problemFilter !== 'All' && c.problemType !== problemFilter) return false;

    return true;
  });

  const handleOpenEditModal = (c: Complaint) => {
    setEditingComplaint(c);
    setNewStatus(c.status);
    setAdminRemarks(c.adminRemarks || '');
    if (c.assignedTeam) {
      setLinemanName(c.assignedTeam.name);
      setLinemanPhone(c.assignedTeam.phone);
      setLinemanDesignation(c.assignedTeam.designation);
    } else {
      setLinemanName('M. Balakrishnan');
      setLinemanPhone('944585' + Math.floor(1000 + Math.random() * 9000));
      setLinemanDesignation('Assistant Engineer (O&M)');
    }
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    const assignedTeam: AssignedTeam = {
      name: linemanName.trim() || 'R. Murugavel',
      designation: linemanDesignation || 'Line Inspector',
      phone: linemanPhone.trim() || '9445851230',
      substation: `${editingComplaint.district} Central Substation`,
      sectionOffice: `${editingComplaint.district} Urban Section`,
    };

    updateComplaintStatus(editingComplaint.id, newStatus, adminRemarks, assignedTeam);

    setToastMessage(`Ticket #${editingComplaint.id} updated to "${newStatus}" successfully!`);
    setTimeout(() => setToastMessage(null), 3500);
    setEditingComplaint(null);
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Complaint ID',
      'Consumer Name',
      'Mobile',
      'District',
      'Area',
      'Problem Type',
      'Severity',
      'Status',
      'Created At',
      'Remarks',
    ];

    const rows = filteredComplaints.map((c) => [
      c.id,
      `"${c.consumerName}"`,
      c.mobileNumber,
      `"${c.district}"`,
      `"${c.talukVillage}"`,
      `"${c.problemType}"`,
      c.severity,
      c.status,
      c.createdAt,
      `"${c.adminRemarks || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TN_ELEC_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data: District breakdown
  const districtChartData = Object.entries(stats.districtCounts)
    .map(([dist, count]) => ({
      label: dist,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);

  // Chart data: Problem breakdown
  const problemChartData = Object.entries(stats.problemCounts)
    .map(([prob, count]) => ({
      label: prob,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);

  // Status donut data
  const statusDonutData = [
    { label: 'Resolved', value: stats.resolved, color: '#10b981' },
    { label: 'In Progress', value: stats.inProgress, color: '#6366f1' },
    { label: 'Pending/Assigned', value: stats.pending, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-yellow-300 px-4 py-3 rounded-xl shadow-2xl border border-yellow-400/50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Admin Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Shield className="w-3.5 h-3.5 text-yellow-500" />
            <span>{t('Department Administration Portal', 'மின்வாரிய நிர்வாக பலகை')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('Administrative Grievance Management Dashboard', 'மின் குறைதீர்ப்பு மேலாண்மை கட்டுப்பாட்டகம்')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t(
              'Supervise statewide electricity complaints, assign maintenance crews, and update live restoration statuses.',
              'அனைத்து மாவட்ட புகார்களை கண்காணித்து, களப்பணியாளர்களை நியமித்து நிலை மாற்றங்களை மேற்கொள்ளலாம்.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNavigateToReport}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('Total Complaints', 'மொத்த புகார்கள்')}
          value={stats.total}
          subtitle="All 38 TN Districts"
          icon={Zap}
          color="blue"
        />

        <StatCard
          title={t('Pending Tickets', 'நிலுவையில் உள்ளவை')}
          value={stats.pending}
          subtitle="Awaiting field assignment"
          icon={Clock}
          color="yellow"
        />

        <StatCard
          title={t('In Progress / Field Work', 'பணியில் உள்ளவை')}
          value={stats.inProgress}
          subtitle="Crew working on site"
          icon={Wrench}
          color="purple"
        />

        <StatCard
          title={t('Resolved & Closed', 'தீர்க்கப்பட்டவை')}
          value={stats.resolved}
          subtitle={`${stats.resolvedRatePercent}% Resolution Rate`}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Interactive Charts: District Activity & Problem Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Chart */}
        <div className="lg:col-span-1">
          <HorizontalBarChart
            data={districtChartData}
            title={t('Complaints by District', 'மாவட்ட வாரியான புகார்கள்')}
            subtitle="Top reporting districts in Tamil Nadu"
            maxBars={6}
          />
        </div>

        {/* Problem Distribution */}
        <div className="lg:col-span-1">
          <HorizontalBarChart
            data={problemChartData}
            title={t('Grievance Categories', 'பிரச்சனை பிரிவுகள்')}
            subtitle="Most reported electrical faults"
            maxBars={6}
          />
        </div>

        {/* Status Donut */}
        <div className="lg:col-span-1">
          <DonutChart
            data={statusDonutData}
            title={t('Resolution Status', 'தீர்வு விகிதம்')}
            subtitle="Current live ticket status"
          />
        </div>
      </div>

      {/* Filter and Search Bar for Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'Search by Ticket ID, Consumer Name, Mobile, Village, or District...',
                'புகார் எண், பெயர், அலைபேசி, கிராமம் கொண்டு தேடுக...'
              )}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* District Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Districts (38)</option>
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Problem Filter */}
            <select
              value={problemFilter}
              onChange={(e) => setProblemFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-[150px] truncate"
            >
              <option value="All">All Categories</option>
              {PROBLEM_TYPES.map((pt) => (
                <option key={pt.id} value={pt.name}>
                  {pt.name}
                </option>
              ))}
            </select>

            {(searchQuery || statusFilter !== 'All' || districtFilter !== 'All' || problemFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setDistrictFilter('All');
                  setProblemFilter('All');
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Complaints Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Ticket ID</th>
                <th className="py-3 px-3.5">Consumer & Contact</th>
                <th className="py-3 px-3.5">District & Area</th>
                <th className="py-3 px-3.5">Problem Type</th>
                <th className="py-3 px-3.5">Severity</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Assigned Lineman</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No complaints matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {c.id}
                      {c.isDemo && (
                        <span className="block text-[9px] uppercase font-bold text-amber-700 font-sans">
                          Demo Data
                        </span>
                      )}
                    </td>

                    {/* Consumer */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900">{c.consumerName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{c.mobileNumber}</div>
                    </td>

                    {/* District & Location */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-semibold text-slate-900">{c.district}</div>
                      <div className="text-slate-500 text-[11px] max-w-[160px] truncate">
                        {c.talukVillage}
                      </div>
                    </td>

                    {/* Problem */}
                    <td className="py-3.5 px-3.5 max-w-[180px]">
                      <span className="font-medium text-slate-800 block truncate">
                        {c.problemType}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <SeverityBadge severity={c.severity} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Assigned Crew */}
                    <td className="py-3.5 px-3.5 text-slate-700 whitespace-nowrap">
                      {c.assignedTeam ? (
                        <div>
                          <div className="font-semibold text-slate-900">{c.assignedTeam.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.assignedTeam.phone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Update Status & Remarks"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>

                        <button
                          onClick={() => onNavigateToTrack(c.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="View Citizen Timeline"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
          <span>
            Showing <strong className="text-slate-900">{filteredComplaints.length}</strong> of{' '}
            <strong className="text-slate-900">{complaints.length}</strong> total complaints
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time local state synchronized. Changes persist automatically.
          </span>
        </div>
      </div>

      {/* Status Update Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Update Official Status
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Ticket #{editingComplaint.id}
                </h3>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-4 text-xs sm:text-sm">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Complaint Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Submitted">Submitted (Under Initial Review)</option>
                  <option value="Assigned">Assigned (Dispatched to Substation)</option>
                  <option value="In Progress">In Progress (Line Gang on Site)</option>
                  <option value="Resolved">Resolved (Power Restored & Verified)</option>
                  <option value="Rejected">Rejected / Closed (Invalid / Duplicate)</option>
                </select>
              </div>

              {/* Official Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Section Office Action Remarks *
                </label>
                <textarea
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="e.g. 11kV conductor spliced and tensioned; new fuse link replaced at transformer fence."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This message will be visible to the citizen in their tracking timeline.
                </p>
              </div>

              {/* Assign Lineman Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                  Assign Field Lineman / Junior Engineer
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Lineman Name:
                    </label>
                    <input
                      type="text"
                      value={linemanName}
                      onChange={(e) => setLinemanName(e.target.value)}
                      placeholder="e.g. R. Murugavel"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Lineman Mobile:
                    </label>
                    <input
                      type="tel"
                      value={linemanPhone}
                      onChange={(e) => setLinemanPhone(e.target.value)}
                      placeholder="9445851230"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Designation:
                  </label>
                  <input
                    type="text"
                    value={linemanDesignation}
                    onChange={(e) => setLinemanDesignation(e.target.value)}
                    placeholder="Assistant Engineer (O&M)"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Status & Log Timeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
