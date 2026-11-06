import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import {
  Zap,
  ShieldCheck,
  Clock,
  Phone,
  AlertTriangle,
  FileText,
  ChevronDown,
  Building,
  CheckCircle,
  Award,
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { t } = useComplaints();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the unique Complaint ID work in Tamil Nadu Electrical Tracking System?',
      a: 'Every time you register an electrical problem, our system generates an official tracking ID (e.g. TN-ELEC-2026-XXXXX). This ticket is immediately queued in the respective circle substation database. You can track live dispatch, assigned lineman names, and completion updates without needing to visit an EB office in person.',
    },
    {
      q: 'What is the toll-free emergency helpline number for electrical faults in Tamil Nadu?',
      a: 'The statewide unified toll-free 24x7 customer care number is 1912. It can be reached free of cost from any mobile or landline across all 38 districts of Tamil Nadu.',
    },
    {
      q: 'What are the official restoration timelines (SLAs) for power outages in Tamil Nadu?',
      a: 'Under the TNERC (Tamil Nadu Electricity Regulatory Commission) Standards of Performance: Urban power outages must be restored within 2 to 4 hours; Rural outages within 4 to 8 hours; Snapped live wires within 2 hours; and burnt distribution transformers within 24 hours.',
    },
    {
      q: 'Are all 38 districts of Tamil Nadu supported?',
      a: 'Yes, all 38 revenue districts from Chennai, Coimbatore, and Madurai to Nilgiris, Tenkasi, and Kanyakumari are integrated with regional distribution circles.',
    },
    {
      q: 'What should I do if I see a fallen wire or an open pillar box on the road?',
      a: 'Do not approach the wire. Maintain a safe perimeter of at least 15 feet. Immediately call 1912 or register an Emergency grievance ticket on this portal by ticking "Mark as Emergency / Immediate Life Hazard".',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          <span>{t('Public Utility Service', 'பொதுமக்கள் மின் சேவை')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('About Tamil Nadu Electrical Tracking System', 'தமிழ்நாடு மின்சார கண்காணிப்பு தளம்')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'A digital governance initiative providing transparent, district-wise electricity grievance reporting, tracking, and rapid field crew mobilization across all 38 districts of Tamil Nadu.',
            'தமிழ்நாட்டின் அனைத்து 38 மாவட்ட மக்களும் மின்தடை மற்றும் மின் விபத்து அபாயங்களை எளிதில் பதிவு செய்து தீர்வு காணும் தளம்.'
          )}
        </p>
      </div>

      {/* Mission & Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {t('Rapid Life Safety Protection', 'உயிர் பாதுகாப்பு முன்னுரிமை')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Immediate dispatch protocols for emergency hazards such as snapped live conductors, smoking transformers, and flood-prone open feeder boxes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {t('Guaranteed Restoration SLAs', 'காலவரையறை தீர்வு')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict compliance with Tamil Nadu Electricity Regulatory Commission (TNERC) standards for uninterrupted residential, commercial, and agricultural power.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {t('100% 38 Districts Covered', '38 மாவட்ட முழு இணைப்பு')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From Chennai metro feeders to the Nilgiris hills and Kanyakumari coastal grid, all section offices and linesmen are linked directly.
          </p>
        </div>
      </div>

      {/* Citizen Grievance Charter & SLAs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Standard Operating Procedures
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {t('Citizen Service Level Agreements (SLAs)', 'குறைதீர்ப்பு கால அவகாச நெறிமுறைகள்')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Prescribed maximum resolution timeframes mandated for electricity distribution circles:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-blue-700 font-black text-lg block">2 - 4 Hours</span>
            <span className="font-bold text-slate-900 block mt-1">Urban Power Outage</span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">
              Phase fuse blow, feeder trip or cable fault in corporation/municipal areas.
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-blue-700 font-black text-lg block">&lt; 2 Hours</span>
            <span className="font-bold text-slate-900 block mt-1">Snapped Live Cable</span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">
              Emergency priority line isolation & cordoning off to avoid human/animal casualties.
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-blue-700 font-black text-lg block">Within 24 Hours</span>
            <span className="font-bold text-slate-900 block mt-1">Burnt Transformer</span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">
              Replacement with standby buffer unit from district circle store.
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-blue-700 font-black text-lg block">Within 48 Hours</span>
            <span className="font-bold text-slate-900 block mt-1">Burnt Meter Replacement</span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">
              MRT testing team replacement with new smart electronic DLMS meter.
            </span>
          </div>
        </div>
      </div>

      {/* Safety Protocol Section */}
      <div className="bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 text-yellow-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              {t(
                'Monsoon & Storm Electrical Safety Instructions',
                'மழைக்கால மின் பாதுகாப்பு முன்னெச்சரிக்கைகள்'
              )}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              Please follow these vital safety rules to safeguard lives
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-medium">
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-600/30 flex items-start gap-2.5">
            <span className="font-bold text-red-600">✕</span>
            <span>Never touch or step on snapped electric wires lying on water puddles or roads.</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-600/30 flex items-start gap-2.5">
            <span className="font-bold text-red-600">✕</span>
            <span>Do not tie cattle or animals to electric poles, stay wires, or transformer fences.</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-600/30 flex items-start gap-2.5">
            <span className="font-bold text-emerald-700">✓</span>
            <span>Switch off the main breaker switch during heavy lightning and floor waterlogging.</span>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-600/30 flex items-start gap-2.5">
            <span className="font-bold text-emerald-700">✓</span>
            <span>Keep tree branches trimmed at least 5 feet away from passing overhead electric lines.</span>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t('Frequently Asked Questions (FAQ)', 'அடிக்கடி கேட்கப்படும் கேள்விகள்')}
        </h2>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
