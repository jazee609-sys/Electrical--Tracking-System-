import React, { useState, useEffect } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { TAMIL_NADU_DISTRICTS } from '../data/districts';
import { HorizontalBarChart, DonutChart, StatCard } from '../components/Charts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import {
  Building2,
  MapPin,
  Phone,
  Zap,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  Activity,
  Layers,
} from 'lucide-react';

interface DistrictDashboardProps {
  initialDistrict?: string;
  onNavigateToTrack: (id: string) => void;
  onNavigateToReport: (district: string) => void;
}

export const DistrictDashboard: React.FC<DistrictDashboardProps> = ({
  initialDistrict,
  onNavigateToTrack,
  onNavigateToReport,
}) => {
  const { complaints, stats, t } = useComplaints();
  const [selectedDistrictName, setSelectedDistrictName] = useState(
    initialDistrict || 'Chennai'
  );
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    if (initialDistrict) {
      setSelectedDistrictName(initialDistrict);
    }
  }, [initialDistrict]);

  const currentDistrict =
    TAMIL_NADU_DISTRICTS.find((d) => d.name === selectedDistrictName) ||
    TAMIL_NADU_DISTRICTS[2]; // Default to Chennai

  // District specific complaints
  const districtComplaints = complaints.filter(
    (c) => c.district.toLowerCase() === selectedDistrictName.toLowerCase()
  );

  const filteredComplaints = districtComplaints.filter((c) => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  // Calculate metrics for current district
  const distTotal = districtComplaints.length;
  const distPending = districtComplaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned'
  ).length;
  const distInProgress = districtComplaints.filter((c) => c.status === 'In Progress').length;
  const distResolved = districtComplaints.filter((c) => c.status === 'Resolved').length;
  const distEmergency = districtComplaints.filter(
    (c) => c.severity === 'Emergency' && c.status !== 'Resolved'
  ).length;

  const resolutionRate = distTotal > 0 ? Math.round((distResolved / distTotal) * 100) : 100;

  // Problem breakdown for this district
  const problemMap: Record<string, number> = {};
  districtComplaints.forEach((c) => {
    problemMap[c.problemType] = (problemMap[c.problemType] || 0) + 1;
  });

  const problemChartData = Object.entries(problemMap).map(([label, value]) => ({
    label,
    value,
  }));

  // Status donut data
  const statusDonutData = [
    { label: 'Resolved', value: distResolved, color: '#10b981' },
    { label: 'In Progress', value: distInProgress, color: '#6366f1' },
    { label: 'Pending', value: distPending, color: '#f59e0b' },
  ];

  // Statewide district ranking data for comparison
  const statewideDistrictData = TAMIL_NADU_DISTRICTS.map((d) => ({
    label: d.name,
    secondaryLabel: d.region,
    value: stats.districtCounts[d.name] || 0,
  })).sort((a, b) => b.value - a.value);

  const availableRegions = [
    'All',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Trichy',
    'Tirunelveli',
    'Erode',
    'Vellore',
    'Villupuram',
  ];

  const filteredDistricts =
    regionFilter === 'All'
      ? TAMIL_NADU_DISTRICTS
      : TAMIL_NADU_DISTRICTS.filter((d) => d.region === regionFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Building2 className="w-3.5 h-3.5 text-yellow-500" />
            <span>{t('District-wise Grid Redressal', 'மாவட்ட வாரியான நிலவரம்')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('Tamil Nadu 38 Districts Dashboard', '38 மாவட்ட மின் கண்காணிப்பு பலகை')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t(
              'Select any district to inspect active outages, substations, resolution SLAs, and contact helpline.',
              'உங்கள் மாவட்டத்தை தேர்வு செய்து நடப்பு மின்தடைகள், துணை மின்நிலையங்கள் மற்றும் அதிகாரிகளின் தொடர்பை அறியலாம்.'
            )}
          </p>
        </div>

        {/* Quick Report in this district button */}
        <button
          onClick={() => onNavigateToReport(selectedDistrictName)}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Report Issue in {selectedDistrictName}</span>
        </button>
      </div>

      {/* District Selector & Regional Filter Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{t('Select District from Dropdown (All 38 Districts):', 'மாவட்டத்தை தேர்வு செய்க:')}</span>
          </label>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Region:</span>
            {availableRegions.map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2 py-0.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  regionFilter === reg
                    ? 'bg-blue-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown with all 38 districts */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <select
              value={selectedDistrictName}
              onChange={(e) => setSelectedDistrictName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {filteredDistricts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.tamilName}) — {d.region} Zone • HQ: {d.headquarters}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Showing <span className="font-bold text-slate-900">{filteredDistricts.length}</span> of 38 districts
            </span>
          </div>
        </div>
      </div>

      {/* Selected District Details Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                {currentDistrict.region} Region
              </span>
              <span className="text-blue-300 text-xs font-medium">Headquarters: {currentDistrict.headquarters}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {currentDistrict.name} District ({currentDistrict.tamilName})
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Circle Office: {currentDistrict.circleOffice}</span>
            </p>
          </div>

          {/* District helpline card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-xs text-yellow-300 font-semibold uppercase tracking-wider">
                District Grievance Helpline
              </p>
              <p className="text-base sm:text-lg font-mono font-black text-white">
                {currentDistrict.helpline}
              </p>
              <p className="text-[11px] text-blue-200">24/7 Substation Operator Line</p>
            </div>
          </div>
        </div>

        {/* Major Sub-Stations Pills */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-2">
            Key Transmission Substations in {currentDistrict.name}:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentDistrict.majorSubstations.map((ss, idx) => (
              <span
                key={idx}
                className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-lg border border-white/15 font-medium transition-colors"
              >
                ⚡ {ss}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* District KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('District Complaints', 'மாவட்ட புகார்கள்')}
          value={distTotal}
          subtitle={`In ${currentDistrict.name}`}
          icon={Zap}
          color="blue"
        />

        <StatCard
          title={t('Pending / Dispatched', 'நிலுவையில் உள்ளவை')}
          value={distPending}
          subtitle="Queued to local line gang"
          icon={Clock}
          color="yellow"
        />

        <StatCard
          title={t('Work in Progress', 'பணியில் உள்ளவை')}
          value={distInProgress}
          subtitle="Line crew on field"
          icon={Layers}
          color="purple"
        />

        <StatCard
          title={t('Resolved & Closed', 'தீர்க்கப்பட்டவை')}
          value={distResolved}
          subtitle={`${resolutionRate}% resolution rate`}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Visual Analytics for this District */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
            {t('Problems Breakdown in', 'பிரச்சனைகளின் வகை')} {currentDistrict.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4">Distribution by issue category</p>

          {problemChartData.length > 0 ? (
            <HorizontalBarChart
              data={problemChartData}
              maxBars={6}
            />
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No reported complaints currently in {currentDistrict.name}.
            </div>
          )}
        </div>

        {/* Resolution status donut */}
        <div>
          <DonutChart
            data={statusDonutData}
            title={`${currentDistrict.name} Status Distribution`}
            subtitle="Resolved vs In Progress vs Pending"
          />
        </div>
      </div>

      {/* List of Complaints in this District */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('Registered Grievances in', 'பதிவு செய்யப்பட்ட புகார்கள்')} {currentDistrict.name} ({filteredComplaints.length})
            </h3>
            <p className="text-xs text-slate-500">Live ticket ledger for this distribution zone</p>
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <p>No complaints matching filter in {currentDistrict.name}.</p>
            <button
              onClick={() => onNavigateToReport(currentDistrict.name)}
              className="mt-2 text-blue-700 font-bold hover:underline cursor-pointer"
            >
              + Register first complaint for {currentDistrict.name}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-blue-900 text-xs sm:text-sm">
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                    <SeverityBadge severity={c.severity} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{c.problemType}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.talukVillage} • {c.addressLandmark}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                    "{c.description}"
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onNavigateToTrack(c.id)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statewide Comparative Ranking (All 38 Districts) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {t('Statewide Complaint Activity Across Tamil Nadu', 'தமிழ்நாடு 38 மாவட்ட ஒப்பீடு')}
          </h3>
          <p className="text-xs text-slate-500">
            Compare active volume across all 38 districts. Click any bar to inspect that district.
          </p>
        </div>

        <HorizontalBarChart
          data={statewideDistrictData}
          maxBars={12}
          onBarClick={(item) => setSelectedDistrictName(item.label)}
        />
      </div>
    </div>
  );
};
