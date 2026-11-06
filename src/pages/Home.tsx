import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { TAMIL_NADU_DISTRICTS } from '../data/districts';
import { PROBLEM_TYPES } from '../data/problemTypes';
import { StatCard } from '../components/Charts';
import {
  Zap,
  PlusCircle,
  Search,
  PhoneCall,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  ArrowRight,
  MapPin,
  TrendingUp,
  Building2,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string, params?: { problemType?: string; district?: string }) => void;
  onTrackIdSubmit: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onTrackIdSubmit }) => {
  const { t, stats } = useComplaints();
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      onTrackIdSubmit(quickTrackInput.trim());
      onNavigate('track');
    }
  };

  const featuredDistricts = [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Erode',
    'Thanjavur',
    'Vellore',
    'Tiruppur',
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a2558] to-[#041333] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left col */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/70 border border-blue-700/60 text-yellow-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <span>
                  {t(
                    'Active Statewide Grievance Monitoring • 38 Districts of Tamil Nadu',
                    'தமிழ்நாட்டின் அனைத்து 38 மாவட்டங்களுக்குமான உடனடி மின் குறைதீர்ப்பு தளம்'
                  )}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {t(
                  'Tamil Nadu Electrical Tracking System',
                  'தமிழ்நாடு மின்சார குறைதீர்க்கும் மற்றும் கண்காணிப்பு தளம்'
                )}
              </h1>

              <p className="text-base sm:text-lg text-blue-100 max-w-2xl font-normal leading-relaxed">
                {t(
                  'Report power cuts, damaged electric wires, burnt transformers, and voltage fluctuations across all 38 districts. Real-time status tracking and rapid field crew mobilization.',
                  'மின்தடை, அறுந்து விழுந்த மின்கம்பிகள், டிரான்ஸ்பார்மர் தீப்பொறி போன்ற பிரச்சனைகளை உடனடியாக உங்கள் மாவட்டத்திற்கு உட்பட்ட மின் அலுவலகத்தில் பதிவு செய்து கண்காணிக்கலாம்.'
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('report')}
                  className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-5 h-5 fill-current" />
                  <span>{t('Report Electricity Problem', 'புதிய புகார் பதிவு செய்ய')}</span>
                </button>

                <button
                  onClick={() => onNavigate('districts')}
                  className="bg-blue-900/80 hover:bg-blue-800 text-white font-semibold px-5 py-3.5 rounded-xl border border-blue-700/80 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-yellow-400" />
                  <span>{t('View 38 Districts Status', '38 மாவட்ட நிலவரம்')}</span>
                </button>
              </div>

              {/* Quick Track Input Card */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 max-w-xl">
                <p className="text-xs font-semibold text-yellow-300 mb-2 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  {t('Already registered? Track status instantly:', 'ஏற்கனவே பதிவு செய்த புகாரின் நிலையை அறிய:')}
                </p>
                <form onSubmit={handleQuickTrackSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={quickTrackInput}
                    onChange={(e) => setQuickTrackInput(e.target.value)}
                    placeholder={t(
                      'Enter Complaint ID (e.g. TN-ELEC-2026-80412) or Mobile',
                      'புகார் எண் அல்லது அலைபேசி எண் உள்ளிடவும்'
                    )}
                    className="flex-1 bg-slate-900/90 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-700 focus:outline-hidden focus:border-yellow-400 placeholder:text-slate-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>{t('Track', 'கண்காணி')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right col: Quick Emergency & Metric highlight card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-blue-500/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-sm">TANGEDCO Grid Helpline</h2>
                      <p className="text-xs text-yellow-300">24x7 State Operation Desk</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Online
                  </span>
                </div>

                {/* Toll-free Box */}
                <div className="bg-[#0b285f] p-4 rounded-xl border border-blue-600/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-200 font-medium">State Emergency Helpline</p>
                    <p className="text-2xl font-black text-yellow-300 tracking-wider">1912</p>
                    <p className="text-[11px] text-blue-300">Toll-Free from any mobile or landline</p>
                  </div>
                  <a
                    href="tel:1912"
                    className="w-11 h-11 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  >
                    <PhoneCall className="w-5 h-5 fill-current" />
                  </a>
                </div>

                {/* Live mini stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                    <p className="text-xs text-slate-400">Districts Active</p>
                    <p className="text-xl font-black text-white mt-0.5">38 / 38</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% Coverage</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                    <p className="text-xs text-slate-400">Total Registered</p>
                    <p className="text-xl font-black text-yellow-300 mt-0.5">{stats.total}</p>
                    <p className="text-[10px] text-blue-300 font-semibold mt-0.5">
                      {stats.resolved} Resolved ({stats.resolvedRatePercent}%)
                    </p>
                  </div>
                </div>

                {/* Safety tip note */}
                <div className="text-xs text-slate-300 bg-red-950/40 border border-red-900/50 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    {t(
                      'Emergency? Fallen wires or sparking? Call 1912 immediately or check the Emergency box when reporting.',
                      'அவசர மின்கசிவு அல்லது அறுந்த மின்கம்பிகள் குறித்து உடனடியாக 1912 எண்ணை அழைக்கவும்.'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live State Key Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('Total Complaints', 'மொத்த புகார்கள்')}
            value={stats.total}
            subtitle={t('Across all 38 TN Districts', '38 மாவட்டங்கள்')}
            icon={Zap}
            color="blue"
            trend={{ value: `${stats.pending} currently pending`, isPositive: false }}
          />

          <StatCard
            title={t('Complaints Resolved', 'தீர்க்கப்பட்டவை')}
            value={stats.resolved}
            subtitle={`${stats.resolvedRatePercent}% ${t('Resolution rate', 'தீர்வு விகிதம்')}`}
            icon={CheckCircle2}
            color="green"
            trend={{ value: 'Verified by citizens', isPositive: true }}
          />

          <StatCard
            title={t('Field Work in Progress', 'பணியில் உள்ளவை')}
            value={stats.inProgress}
            subtitle={t('Linemen on site with spares', 'களப்பணியாளர்கள் பணியில்')}
            icon={Clock}
            color="yellow"
            trend={{ value: 'Active maintenance gang', isPositive: true }}
          />

          <StatCard
            title={t('Emergency Hazards Handled', 'அவசர ஆபத்துகள்')}
            value={stats.emergencyCount}
            subtitle={t('High priority safety alerts', 'அதிமுக்கிய முன்னுரிமை')}
            icon={ShieldAlert}
            color="red"
            trend={{ value: 'Priority < 2hr SLA', isPositive: true }}
          />
        </div>
      </section>

      {/* Common Electricity Problem Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{t('Grievance Categories', 'புகார் பிரிவுகள்')}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {t('Common Electricity Problems We Track & Resolve', 'நாங்கள் தீர்த்து வைக்கும் மின்சார சிக்கல்கள்')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t(
                'Select any issue below to directly open a complaint form with pre-filled details.',
                'உங்களுக்கு ஏற்பட்ட பிரச்சனையை கீழே தேர்ந்தெடுத்து உடனடியாக புகார் பதியவும்.'
              )}
            </p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('View All Categories & Report', 'அனைத்து பிரிவுகளும்')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEM_TYPES.slice(0, 6).map((problem) => {
            const isEmergency = problem.defaultSeverity === 'Emergency';
            return (
              <div
                key={problem.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        isEmergency
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {isEmergency ? (
                        <Flame className="w-5 h-5 text-red-600" />
                      ) : (
                        <Zap className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isEmergency
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      SLA: ~{problem.standardSlaHours}h
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    {problem.name}
                  </h3>
                  <p className="text-xs text-yellow-700 font-semibold mt-0.5">{problem.tamilName}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Priority: <span className="font-semibold text-slate-800">{problem.defaultSeverity}</span>
                  </span>
                  <button
                    onClick={() => onNavigate('report', { problemType: problem.name })}
                    className="text-xs font-bold text-blue-700 group-hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('Report This', 'பதிவு செய்')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 38 Districts Quick Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{t('Tamil Nadu Jurisdiction', 'தமிழ்நாடு 38 மாவட்டங்கள்')}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {t('District-wise Electricity Grievance Desks', 'மாவட்ட வாரியான மின் நுகர்வோர் சேவை மையங்கள்')}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                {t(
                  'All 38 districts of Tamil Nadu are fully integrated with sub-station circle offices.',
                  'அனைத்து 38 மாவட்டங்களும் துணை மின் நிலையங்களுடன் இணைக்கப்பட்டுள்ளன.'
                )}
              </p>
            </div>
            <button
              onClick={() => onNavigate('districts')}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>{t('Explore Full 38 Districts Dashboard', '38 மாவட்ட முழு விவரம்')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick chips of featured districts */}
          <div className="flex flex-wrap gap-2 pt-2">
            {featuredDistricts.map((distName) => {
              const count = stats.districtCounts[distName] || 0;
              const distObj = TAMIL_NADU_DISTRICTS.find((d) => d.name === distName);
              return (
                <button
                  key={distName}
                  onClick={() => onNavigate('districts', { district: distName })}
                  className="bg-slate-800/90 hover:bg-blue-800 text-slate-200 hover:text-white px-3 py-2 rounded-lg text-xs font-medium border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <span>
                    {distName} {distObj ? `(${distObj.tamilName})` : ''}
                  </span>
                  {count > 0 && (
                    <span className="bg-yellow-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('districts')}
              className="bg-blue-900/60 hover:bg-blue-900 text-yellow-300 hover:text-yellow-200 px-3 py-2 rounded-lg text-xs font-semibold border border-blue-700/60 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+ 28 More Districts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {t('Simple & Transparent Process', 'எளிய நடைமுறை')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t('How Your Grievance is Tracked & Restored', 'உங்கள் புகார் எவ்வாறு தீர்க்கப்படுகிறது?')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'From your fingertip submission to on-ground lineman restoration, every stage is timestamped.',
              'புகார் பதிவு முதல் களப்பணியாளர் பழுது நீக்குவது வரை வெளிப்படையான கண்காணிப்பு.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('1. Report Complaint', '1. புகார் பதிவு')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'Select your district, enter your village/area, mobile number, and select problem type. Unique ID generated instantly.',
                  'மாவட்டம், கிராமம், பிரச்சனையின் வகை ஆகியவற்றை உள்ளிட்டு புகார் எண்ணை பெறுங்கள்.'
                )}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>Instant Ticket ID Issued</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('2. Assigned to Substation', '2. மின் நிலைய ஒதுக்கீடு')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'Automated routing dispatches ticket to the respective Junior Engineer / Lineman gang with contact details.',
                  'உடனடியாக உங்கள் பகுதி துணை மின்நிலைய உதவி பொறியாளருக்கு அனுப்பி வைக்கப்படுகிறது.'
                )}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lineman Contact Shared</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('3. Field Work in Progress', '3. களப்பணி & பழுது நீக்கம்')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'Line crew arrives on site with replacement fuses, transformers, or conductor restringing kits.',
                  'களப்பணியாளர்கள் தேவையான உபகரணங்களுடன் சென்று பழுதை சரிசெய்கின்றனர்.'
                )}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-indigo-700 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Timeline Updates</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('4. Power Restored & Closed', '4. மின்சாரம் மீட்பு')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'Power is charged and tested. Consumer confirms restoration and rates service quality.',
                  'மின்விநியோகம் சீரமைக்கப்பட்டு, நுகர்வோர் திருப்தி உறுதி செய்யப்படுகிறது.'
                )}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Citizen Feedback Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t(
                'Experiencing an Outage or Dangerous Sparking?',
                'மின் தடையா? அல்லது ஆபத்தான மின்கம்பிகளா?'
              )}
            </h2>
            <p className="text-blue-100 text-sm">
              {t(
                'Register your grievance in less than 60 seconds. Our automatic system routes it to your local district section office immediately.',
                'ஒரு நிமிடத்தில் உங்கள் புகாரை பதிவு செய்து நேரலை நிலவரத்தை அறியலாம்.'
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('report')}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 fill-current" />
              <span>{t('Register Complaint Now', 'இப்போதே புகார் செய்க')}</span>
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t('Track by Ticket ID', 'புகார் நிலையை அறிய')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
