import React from 'react';
import { 
  Droplet, 
  Heart, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Clock, 
  Users 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPostRequest: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPostRequest,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
                <Droplet className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Life<span className="text-red-500">Drop</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A community voluntary blood donor network built for urban neighborhoods, towns, and rural communities. We connect patients in critical need directly with nearby verified donors in minutes.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free Voluntary Community Service</span>
            </div>
          </div>

          {/* Col 2: Rapid Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Emergency Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('find')} className="hover:text-white transition-colors">
                  &rarr; Search Nearby Donors
                </button>
              </li>
              <li>
                <button onClick={onOpenPostRequest} className="hover:text-white text-rose-300 font-semibold transition-colors">
                  &rarr; Broadcast Emergency Blood Request
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('requests')} className="hover:text-white transition-colors">
                  &rarr; Live Patient Emergency Feed
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">
                  &rarr; Voluntary Donor Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compatibility')} className="hover:text-white transition-colors">
                  &rarr; Blood Compatibility Chart
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Towns & Urban Areas Covered */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Coverage & Locations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving central hospitals, regional blood banks, town health clinics, and rural trauma units.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Downtown Metro', 'Oakwood West', 'Highland Park', 'Greenfield', 'Northgate', 'Riverside'].map((t) => (
                <span key={t} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: 24/7 Availability & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              24×7 Community Availability
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>"Always Available 24×7 to Save Lives"</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                Volunteers and local donors across towns stand ready day and night for emergency blood transfusions.
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              <strong>Notice:</strong> Blood donation is a non-commercial, voluntary humanitarian gift. Never pay any broker or intermediary.
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} LifeDrop Community Blood Donor Network. Built for life-saving public good.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('verification')} className="hover:text-slate-400">
              Donor Safety Protocols
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('compatibility')} className="hover:text-slate-400">
              Universal Donor Guide
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
