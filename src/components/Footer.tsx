import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Zap, Phone, AlertTriangle, ShieldCheck, ExternalLink, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useComplaints();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-sm">
      {/* Emergency safety strip */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-900/40 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <span className="font-semibold text-slate-100">
              {t(
                'ELECTRICAL SAFETY WARNING: Never touch or go near snapped electric lines or smoking transformers. Maintain minimum 15ft distance.',
                'மின் பாதுகாப்பு எச்சரிக்கை: அறுந்து விழுந்த மின்கம்பிகள் மற்றும் தீப்பொறி பறக்கும் டிரான்ஸ்பார்மர்களை தொடாதீர்கள். 15 அடி தூரம் விலகி நிற்கவும்.'
              )}
            </span>
          </div>
          <a
            href="tel:1912"
            className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>{t('Emergency Dial 1912', 'அவசர அழைப்பு 1912')}</span>
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: System Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-slate-950 shadow-sm">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Electrical Tracking System</h3>
                <p className="text-xs text-yellow-400 font-semibold">Tamil Nadu Portal</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              {t(
                'A dedicated public utility grievance management portal connecting Tamil Nadu citizens across all 38 districts with regional operation & maintenance distribution circles.',
                'தமிழ்நாட்டின் அனைத்து 38 மாவட்ட மக்களின் மின்சார புகார்களை விரைவாக பதிவு செய்து கண்காணிக்க உருவாக்கப்பட்ட இணைய தளம்.'
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Public Service Guarantee • 24x7 Redressal', '24x7 மின் நுகர்வோர் சேவை')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-1.5">
              {t('Citizen Services', 'பொதுமக்கள் சேவைகள்')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="text-slate-300 hover:text-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-yellow-400">›</span>
                  {t('Register New Electricity Complaint', 'புதிய மின் புகார் பதிவு')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="text-slate-300 hover:text-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-yellow-400">›</span>
                  {t('Track Complaint by ID / Mobile', 'புகார் நிலையை அறிய')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('districts')}
                  className="text-slate-300 hover:text-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-yellow-400">›</span>
                  {t('38 Districts Outage & Substation Directory', '38 மாவட்ட துணை மின்நிலையங்கள்')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-slate-300 hover:text-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-yellow-400">›</span>
                  {t('Department Admin & Lineman Portal', 'அதிகாரிகள் & களப்பணியாளர் உள்நுழைவு')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-300 hover:text-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-yellow-400">›</span>
                  {t('Citizen Charter & Restoration SLAs', 'குறைதீர்ப்பு கால அவகாசம் & நெறிமுறைகள்')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Distribution Circles */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-1.5">
              {t('Regional Distribution Zones', 'மின் பகிர்மான மண்டலங்கள்')}
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-400">
              <span className="hover:text-slate-200">Chennai North & South</span>
              <span className="hover:text-slate-200">Coimbatore Region</span>
              <span className="hover:text-slate-200">Madurai Region</span>
              <span className="hover:text-slate-200">Trichy Region</span>
              <span className="hover:text-slate-200">Tirunelveli Region</span>
              <span className="hover:text-slate-200">Salem / Erode Region</span>
              <span className="hover:text-slate-200">Vellore Region</span>
              <span className="hover:text-slate-200">Villupuram Region</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              {t(
                'Covering all 38 districts from Chennai, Coimbatore, Madurai, to Kanyakumari.',
                'சென்னை முதல் கன்னியாகுமரி வரை அனைத்து 38 மாவட்டங்களுக்கும் பொருந்தும்.'
              )}
            </p>
          </div>

          {/* Col 4: Key Contacts */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-1.5">
              {t('Emergency & Grievance Desks', 'உதவி மைய எண்கள்')}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">1912</div>
                  <div className="text-slate-400 text-[11px]">{t('Statewide Toll-Free Helpline', 'மாநில பொது உதவி எண்')}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">grievance@tnelec-portal.gov.in</div>
                  <div className="text-slate-400 text-[11px]">Email Grievance Escalation</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-slate-400 text-[11px]">
                  Electricity Avenue, Anna Salai, Chennai, Tamil Nadu - 600002
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Tamil Nadu Electrical Tracking System (TN-ELEC).
            <span className="ml-1 text-slate-400">All 38 Districts Covered.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-slate-800 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-mono">
              Live Portal Ver 2.4
            </span>
            <span className="text-slate-400">TANGEDCO Compliant Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
