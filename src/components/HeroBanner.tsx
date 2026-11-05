import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  HeartHandshake, 
  Droplet,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BloodGroup } from '../types';

interface HeroBannerProps {
  onSearch: (bloodGroup: BloodGroup, units: number, town: string) => void;
  onOpenPostRequest: () => void;
  onNavigateRegister: () => void;
  totalDonorsCount: number;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onOpenPostRequest,
  onNavigateRegister,
  totalDonorsCount,
}) => {
  const [selectedBlood, setSelectedBlood] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(2);
  const [town, setTown] = useState<string>('Springfield');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedBlood, units, town);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50 border-b border-rose-100">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-red-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 translate-y-12 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-16 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Droplet className="w-4 h-4 fill-red-600 text-red-600 animate-bounce" />
            <span>Voluntary Blood Donors & Emergency Volunteer Network</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="hidden sm:inline-block text-red-700">Urban & Town Friendly</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
            Every Drop Saves a Life. <br />
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Find Verified Donors
            </span> in Minutes.
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A free, community-powered lifeline. When an emergency strikes, connect directly with voluntary donors in your town, view phone numbers, and request critical blood units without delays.
          </p>

          {/* Quick Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenPostRequest}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>🚨 Need Blood Urgently</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateRegister}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-xs hover:border-slate-300 active:scale-95 transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-red-600" />
              <span>Register as a Voluntary Donor</span>
            </button>
          </div>
        </div>

        {/* Rapid Donor Search Card */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-rose-100/80 transition-all hover:border-rose-200"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Quick Emergency Donor Search</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              
              {/* Blood Group Select */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Required Blood Group
                </label>
                <div className="relative">
                  <select
                    value={selectedBlood}
                    onChange={(e) => setSelectedBlood(e.target.value as BloodGroup)}
                    className="w-full h-12 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    {BLOOD_GROUPS.map((grp) => (
                      <option key={grp} value={grp} className="font-semibold text-slate-900">
                        {grp} {grp === 'O-' ? '(Universal Donor)' : grp === 'AB+' ? '(Universal Recipient)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Units Needed */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Units Needed
                </label>
                <div className="relative">
                  <select
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full h-12 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((u) => (
                      <option key={u} value={u}>
                        {u} {u === 1 ? 'Unit (Pint)' : 'Units (Pints)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Town / City Location */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Town / City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Springfield, Oakwood..."
                    className="w-full h-12 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-base placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Donors</span>
                </button>
              </div>

            </div>

            {/* Quick Town Suggestions */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Towns:</span>
              {['Oakwood West', 'Downtown Metro', 'Highland Park', 'Greenfield Valley'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTown(t);
                    onSearch(selectedBlood, units, t);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-red-700 text-slate-600 font-medium transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Key Features & Trust Highlights */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/60 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{totalDonorsCount}+</div>
              <div className="text-xs text-slate-500 font-medium">Voluntary Donors</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/60 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">100% Verified</div>
              <div className="text-xs text-slate-500 font-medium">Safe Health Checks</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/60 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">&lt; 15 Mins</div>
              <div className="text-xs text-slate-500 font-medium">Rapid Response</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/60 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">Always Free</div>
              <div className="text-xs text-slate-500 font-medium">Community Service</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
