import React, { useState, useEffect } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { TAMIL_NADU_DISTRICTS } from '../data/districts';
import { PROBLEM_TYPES } from '../data/problemTypes';
import { Complaint, ProblemSeverity } from '../types';
import {
  Zap,
  CheckCircle,
  Copy,
  Printer,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Phone,
  User,
  MapPin,
  Building,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface ReportComplaintProps {
  initialProblemType?: string;
  initialDistrict?: string;
  onNavigateToTrack: (complaintId: string) => void;
}

export const ReportComplaint: React.FC<ReportComplaintProps> = ({
  initialProblemType,
  initialDistrict,
  onNavigateToTrack,
}) => {
  const { addComplaint, t } = useComplaints();

  // Form states
  const [consumerName, setConsumerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [district, setDistrict] = useState(initialDistrict || 'Chennai');
  const [talukVillage, setTalukVillage] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [problemType, setProblemType] = useState(initialProblemType || PROBLEM_TYPES[0].name);
  const [severity, setSeverity] = useState<ProblemSeverity>('High');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);
  const [isEmergencyChecked, setIsEmergencyChecked] = useState(false);

  // Validation & UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync initial props if they change
  useEffect(() => {
    if (initialProblemType) {
      setProblemType(initialProblemType);
      const found = PROBLEM_TYPES.find((p) => p.name === initialProblemType);
      if (found) {
        setSeverity(found.defaultSeverity);
        if (found.defaultSeverity === 'Emergency') {
          setIsEmergencyChecked(true);
        }
      }
    }
  }, [initialProblemType]);

  useEffect(() => {
    if (initialDistrict) {
      setDistrict(initialDistrict);
    }
  }, [initialDistrict]);

  // Handle problem type change
  const handleProblemChange = (name: string) => {
    setProblemType(name);
    const found = PROBLEM_TYPES.find((p) => p.name === name);
    if (found) {
      setSeverity(found.defaultSeverity);
      if (found.defaultSeverity === 'Emergency') {
        setIsEmergencyChecked(true);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!consumerName.trim()) {
      newErrors.consumerName = t('Please enter complainant name', 'பெயரை உள்ளிடவும்');
    }

    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = t('Please enter 10-digit mobile number', '10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்');
    } else if (cleanMobile.length !== 10) {
      newErrors.mobileNumber = t('Mobile number must be exactly 10 digits', 'அலைபேசி எண் சரியாக 10 இலக்கமாக இருக்க வேண்டும்');
    }

    if (!district) {
      newErrors.district = t('Please select a district', 'மாவட்டத்தை தேர்வு செய்யவும்');
    }

    if (!talukVillage.trim()) {
      newErrors.talukVillage = t('Please enter village, town or taluk', 'கிராமம், நகரம் அல்லது தாலுகாவை உள்ளிடவும்');
    }

    if (!addressLandmark.trim()) {
      newErrors.addressLandmark = t('Please enter street or landmark', 'தெரு அல்லது அடையாளத்தை உள்ளிடவும்');
    }

    if (!description.trim()) {
      newErrors.description = t('Please describe the problem', 'பிரச்சனையை சுருக்கமாக விவரிக்கவும்');
    } else if (description.trim().length < 10) {
      newErrors.description = t('Description must be at least 10 characters', 'குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate short network delay for realism
    setTimeout(() => {
      const finalSeverity: ProblemSeverity = isEmergencyChecked ? 'Emergency' : severity;

      const created = addComplaint({
        consumerName,
        mobileNumber,
        district,
        talukVillage,
        addressLandmark,
        consumerNumber: consumerNumber || undefined,
        problemType,
        severity: finalSeverity,
        description,
        attachmentUrl,
      });

      setSubmittedComplaint(created);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Sample photo attachments simulation
  const handleSimulatePhoto = (type: 'transformer' | 'wire' | 'meter') => {
    const urls = {
      transformer: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80',
      wire: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      meter: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80',
    };
    setAttachmentUrl(urls[type]);
  };

  // If already submitted, show official acknowledgement slip
  if (submittedComplaint) {
    const selectedDistObj = TAMIL_NADU_DISTRICTS.find((d) => d.name === submittedComplaint.district);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div
          id="printable-receipt"
          className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 text-center relative">
            <div className="w-16 h-16 rounded-full bg-white text-emerald-700 mx-auto flex items-center justify-center shadow-md mb-3">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {t('Official Grievance Receipt Generated', 'அதிகாரப்பூர்வ புகார் பதிவு ரசீது')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {t('Complaint Registered Successfully', 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!')}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
              {t(
                'Your electrical problem has been queued to the respective distribution section office and field lineman gang.',
                'உங்கள் புகார் உங்கள் மாவட்டத்திற்குட்பட்ட உதவி பொறியாளர் மற்றும் களப்பணியாளர்களுக்கு அனுப்பப்பட்டுள்ளது.'
              )}
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-xl p-5 text-center relative">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {t('Unique Complaint Tracking ID', 'தனித்துவ புகார் எண்')}
              </p>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-blue-900 tracking-wider">
                  {submittedComplaint.id}
                </span>
                <button
                  onClick={() => handleCopyId(submittedComplaint.id)}
                  title="Copy Complaint ID"
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedId && (
                <span className="text-xs text-emerald-600 font-bold mt-1 inline-block animate-fade-in">
                  ✓ {t('Copied to clipboard!', 'நகலெடுக்கப்பட்டது!')}
                </span>
              )}
              <p className="text-[11px] text-slate-500 mt-2">
                {t(
                  'Please save this Complaint ID. You will need it to track restoration progress or follow up with the Junior Engineer.',
                  'இந்த புகார் எண்ணை குறித்து வைத்துக் கொள்ளவும். நிலையை அறிய இது தேவைப்படும்.'
                )}
              </p>
            </div>

            {/* Complaint Summary Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('Complainant Name', 'புகார்தாரர் பெயர்')}</span>
                <span className="font-bold text-slate-900">{submittedComplaint.consumerName}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('Mobile Number', 'அலைபேசி எண்')}</span>
                <span className="font-bold text-slate-900">{submittedComplaint.mobileNumber}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('District', 'மாவட்டம்')}</span>
                <span className="font-bold text-slate-900">
                  {submittedComplaint.district}{' '}
                  {selectedDistObj ? `(${selectedDistObj.tamilName})` : ''}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('Village / Area', 'கிராமம் / பகுதி')}</span>
                <span className="font-bold text-slate-900">{submittedComplaint.talukVillage}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('Problem Category', 'பிரச்சனை பிரிவு')}</span>
                <span className="font-bold text-slate-900">{submittedComplaint.problemType}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-xs">{t('Priority / Urgency', 'முன்னுரிமை')}</span>
                <span className="font-bold text-rose-700">{submittedComplaint.priority}</span>
              </div>

              {submittedComplaint.consumerNumber && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 sm:col-span-2">
                  <span className="text-slate-500 block text-xs">
                    {t('EB Consumer Connection Number', 'மின் இணைப்பு எண்')}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {submittedComplaint.consumerNumber}
                  </span>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 sm:col-span-2">
                <span className="text-slate-500 block text-xs">{t('Exact Location & Landmark', 'அடையாளம்')}</span>
                <span className="font-medium text-slate-800">{submittedComplaint.addressLandmark}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 sm:col-span-2">
                <span className="text-slate-500 block text-xs">{t('Description', 'விவரம்')}</span>
                <span className="text-slate-800">{submittedComplaint.description}</span>
              </div>
            </div>

            {/* Estimated Resolution Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-blue-950 block">
                    {t('Estimated Target Resolution', 'எதிர்பார்க்கப்படும் தீர்வு நேரம்')}
                  </span>
                  <span className="text-blue-800 text-xs">
                    Standard restoration timeframe: ~4 to 8 hours depending on feeder load
                  </span>
                </div>
              </div>
              <span className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0">
                Active Queue
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                onClick={() => onNavigateToTrack(submittedComplaint.id)}
                className="w-full sm:flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{t('Track Real-Time Status Now', 'நேரலை நிலையை கண்காணிக்க')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print Receipt', 'ரசீது அச்சிடு')}</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedComplaint(null);
                  setDescription('');
                  setAddressLandmark('');
                }}
                className="w-full sm:w-auto text-slate-600 hover:text-slate-900 py-3 px-4 rounded-xl text-xs font-semibold underline cursor-pointer"
              >
                {t('Register Another', 'மற்றொரு புகார்')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          <span>{t('TANGEDCO Public Redressal', 'மின் நுகர்வோர் குறைதீர்ப்பு')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {t('Register Electricity Complaint', 'மின்சார புகார் பதிவு')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          {t(
            'Report power disruptions, transformer faults, or broken power lines across any of the 38 districts of Tamil Nadu. A unique tracking ID will be generated upon submission.',
            'தமிழ்நாட்டின் அனைத்து 38 மாவட்ட மக்களுக்குமான மின் புகார் பதிவு படிவம். பதிவு செய்தவுடன் உடனடி புகார் எண் வழங்கப்படும்.'
          )}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: District & Area Selection (CRITICAL: ALL 38 DISTRICTS) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{t('1. District & Location Details (All 38 Districts)', '1. மாவட்டம் மற்றும் இருப்பிட விவரங்கள்')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* District Dropdown - All 38 districts */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Select District (தமிழ்நாடு மாவட்டம்) *', 'மாவட்டத்தை தேர்ந்தெடுக்கவும் *')}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    errors.district ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  {TAMIL_NADU_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      {dist.name} ({dist.tamilName}) - {dist.region} Region
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-red-600 mt-1">{errors.district}</p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  {t(
                    'All 38 revenue districts of Tamil Nadu are included.',
                    'தமிழ்நாட்டின் 38 மாவட்டங்களும் உள்ளன.'
                  )}
                </p>
              </div>

              {/* Taluk / Village / Town / Ward */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Village / Town / Taluk / Ward *', 'கிராமம் / நகரம் / தாலுகா *')}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={talukVillage}
                    onChange={(e) => setTalukVillage(e.target.value)}
                    placeholder={t('e.g. Anna Nagar West, Madurai North, etc.', 'எ.கா: அண்ணா நகர் மேற்கு, கூத்தம்பாக்கம்')}
                    className={`w-full bg-slate-50 border rounded-lg pl-9.5 pr-3 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      errors.talukVillage ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.talukVillage && (
                  <p className="text-xs text-red-600 mt-1">{errors.talukVillage}</p>
                )}
              </div>
            </div>

            {/* Street / Door No / Landmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Street / Door No / Landmark *', 'தெரு பெயர் / கதவு எண் / அடையாளம் *')}
              </label>
              <input
                type="text"
                value={addressLandmark}
                onChange={(e) => setAddressLandmark(e.target.value)}
                placeholder={t(
                  'e.g. 4th Cross Street, Near Primary Health Centre / Opposite Bus Stand',
                  'எ.கா: 4வது குறுக்கு தெரு, அரசு ஆரம்ப சுகாதார நிலையம் அருகில்'
                )}
                className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.addressLandmark ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.addressLandmark && (
                <p className="text-xs text-red-600 mt-1">{errors.addressLandmark}</p>
              )}
            </div>
          </div>

          {/* Section 2: Consumer & Contact Information */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{t('2. Consumer & Contact Details', '2. நுகர்வோர் மற்றும் தொடர்பு விவரங்கள்')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Complainant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Complainant Full Name *', 'புகார்தாரர் பெயர் *')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    placeholder={t('e.g. Sundaram K', 'எ.கா: சுந்தரம் கே')}
                    className={`w-full bg-slate-50 border rounded-lg pl-9.5 pr-3 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      errors.consumerName ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.consumerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.consumerName}</p>
                )}
              </div>

              {/* 10-Digit Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('10-Digit Mobile Number (for SMS & Lineman Call) *', '10 இலக்க அலைபேசி எண் *')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <div className="absolute left-9.5 top-2.5 text-xs text-slate-500 font-semibold border-r border-slate-300 pr-2">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9840123456"
                    className={`w-full bg-slate-50 border rounded-lg pl-20 pr-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      errors.mobileNumber ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.mobileNumber}</p>
                )}
              </div>
            </div>

            {/* Optional EB Consumer Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>{t('EB Consumer Connection Number (Optional)', 'மின் இணைப்பு எண் (இருப்பின் குறிப்பிடலாம்)')}</span>
                <span className="text-[11px] text-slate-400 font-normal">Found on electricity bill or meter card</span>
              </label>
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="e.g. 01-240-004-892"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Problem Classification */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>{t('3. Electricity Problem Type & Severity', '3. மின்சார பிரச்சனையின் வகை')}</span>
            </h2>

            {/* Problem Type Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Select Problem Category *', 'பிரச்சனை வகையை தேர்ந்தெடுக்கவும் *')}
              </label>
              <select
                value={problemType}
                onChange={(e) => handleProblemChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {PROBLEM_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.name}>
                    {pt.name} — {pt.tamilName}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Hazard Checkbox */}
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergencyChecked}
                  onChange={(e) => setIsEmergencyChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-red-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    {t(
                      'Mark as Emergency / Immediate Life Hazard',
                      'உடனடி உயிராபத்து / அவசர பிரச்சனை என குறிக்கவும்'
                    )}
                  </span>
                  <p className="text-xs text-red-700 mt-0.5">
                    {t(
                      'Select this if you see live wire fallen on street, sparking transformer, smoking pillar box, or risk to public life.',
                      'அறுந்த மின்கம்பி, தீப்பொறி பறக்கும் டிரான்ஸ்பார்மர் போன்ற உடனடி ஆபத்துகளுக்கு இதை தேர்வு செய்யவும்.'
                    )}
                  </p>
                </div>
              </label>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('Detailed Problem Description *', 'பிரச்சனையின் விரிவான விளக்கம் *')}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(
                  'Explain the situation (e.g. Power is out for the past 3 hours on 4th street, or transformer sparking near the grocery shop).',
                  'பிரச்சனை குறித்து விவரிக்கவும் (எ.கா: கடந்த 3 மணி நேரமாக மின்தடை, அல்லது டிரான்ஸ்பார்மரில் தீப்பொறி).'
                )}
                className={`w-full bg-slate-50 border rounded-lg p-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                <span>{errors.description ? <span className="text-red-600">{errors.description}</span> : 'Provide specific details'}</span>
                <span>{description.length} chars</span>
              </div>
            </div>

            {/* Photo Attachment Simulation */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>{t('Attach Photo of Damage / Fault (Optional)', 'புகைப்படம் இணைக்க (விருப்பப்பட்டால்)')}</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Helps linemen prepare the correct replacement parts before dispatching.
              </p>

              {attachmentUrl ? (
                <div className="relative inline-block border rounded-lg overflow-hidden border-slate-300">
                  <img src={attachmentUrl} alt="Complaint preview" className="w-48 h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => setAttachmentUrl(undefined)}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 text-xs hover:bg-red-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">Quick sample photos for testing:</span>
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto('transformer')}
                    className="text-xs bg-white border border-slate-300 hover:border-blue-500 px-2.5 py-1 rounded text-slate-700 cursor-pointer"
                  >
                    + Transformer Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto('wire')}
                    className="text-xs bg-white border border-slate-300 hover:border-blue-500 px-2.5 py-1 rounded text-slate-700 cursor-pointer"
                  >
                    + Snapped Line Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto('meter')}
                    className="text-xs bg-white border border-slate-300 hover:border-blue-500 px-2.5 py-1 rounded text-slate-700 cursor-pointer"
                  >
                    + Burnt Meter Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                {t(
                  'By registering, your ticket is entered into the official TNEB circle dispatch log.',
                  'பதிவு செய்வதன் மூலம் உங்கள் புகார் அதிகாரப்பூர்வ பதிவேட்டில் பதியப்படும்.'
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>{t('Registering Complaint...', 'பதிவு செய்யப்படுகிறது...')}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{t('Submit Complaint & Generate ID', 'புகாரை சமர்ப்பிக்கவும்')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
