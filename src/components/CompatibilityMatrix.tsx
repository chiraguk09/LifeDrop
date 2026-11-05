import React, { useState } from 'react';
import { 
  Droplet, 
  ArrowRight, 
  Check, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Users, 
  Heart,
  Sparkles
} from 'lucide-react';
import { BloodGroup } from '../types';
import { 
  CAN_DONATE_TO_MAP, 
  COMPATIBLE_DONORS_MAP 
} from '../utils/compatibility';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityMatrix: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const canDonateTo = CAN_DONATE_TO_MAP[selectedGroup];
  const canReceiveFrom = COMPATIBLE_DONORS_MAP[selectedGroup];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Simple Blood Compatibility Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Who Can You Help & Who Can Help You?
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            In an emergency, knowing blood compatibility saves crucial hours. Tap on any blood group below to see an instant visual breakdown of safe donor and recipient combinations.
          </p>
        </div>

        {/* Interactive Selector Chips */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Select Any Blood Group to Explore:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {ALL_BLOOD_GROUPS.map((grp) => {
              const isSelected = selectedGroup === grp;
              return (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`py-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105 font-black'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-red-300 font-bold'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{grp}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">
                    {grp === 'O-' ? 'Universal' : grp === 'AB+' ? 'Recipient' : 'Type'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Results for Selected Blood Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Can Donate To Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  <span className="text-red-600">{selectedGroup}</span> Can Donate To:
                </h3>
                <p className="text-xs text-slate-500">
                  Patients with these blood groups can safely receive your blood
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              {canDonateTo.length} of 8 Types
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {ALL_BLOOD_GROUPS.map((grp) => {
              const matches = canDonateTo.includes(grp);
              return (
                <div
                  key={grp}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    matches
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black ring-1 ring-emerald-200'
                      : 'bg-slate-50/50 border-slate-200 text-slate-400 font-medium opacity-50'
                  }`}
                >
                  <div className="text-lg leading-tight">{grp}</div>
                  <div className="text-[10px] mt-1 flex items-center justify-center gap-1 font-bold">
                    {matches ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700">Can Receive</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-slate-400" />
                        <span>Incompatible</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedGroup === 'O-' && (
            <div className="bg-rose-50 p-3.5 rounded-2xl text-xs text-red-900 font-medium border border-rose-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                <strong>Universal Lifesaver:</strong> O Negative red blood cells can be transfused to patients of ANY blood group! Hospitals urgently seek O- voluntary donors for trauma emergencies when patient blood type is unknown.
              </span>
            </div>
          )}
        </div>

        {/* Can Receive From Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplet className="w-5 h-5 fill-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  <span className="text-blue-600">{selectedGroup}</span> Can Receive From:
                </h3>
                <p className="text-xs text-slate-500">
                  Donors with these blood groups can safely donate to you
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              {canReceiveFrom.length} of 8 Types
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {ALL_BLOOD_GROUPS.map((grp) => {
              const matches = canReceiveFrom.includes(grp);
              return (
                <div
                  key={grp}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    matches
                      ? 'bg-blue-50 border-blue-300 text-blue-950 font-black ring-1 ring-blue-200'
                      : 'bg-slate-50/50 border-slate-200 text-slate-400 font-medium opacity-50'
                  }`}
                >
                  <div className="text-lg leading-tight">{grp}</div>
                  <div className="text-[10px] mt-1 flex items-center justify-center gap-1 font-bold">
                    {matches ? (
                      <>
                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                        <span className="text-blue-700">Can Donate</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-slate-400" />
                        <span>Incompatible</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedGroup === 'AB+' && (
            <div className="bg-blue-50 p-3.5 rounded-2xl text-xs text-blue-900 font-medium border border-blue-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Universal Recipient:</strong> An AB Positive patient can safely accept red blood cells from any human blood group!
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Comprehensive Table Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Complete Blood Compatibility Reference Matrix
        </h3>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Blood Group</th>
              <th className="py-3 px-3">Can Donate Whole Blood To</th>
              <th className="py-3 px-3">Can Receive Blood From</th>
              <th className="py-3 px-3">Special Designation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {ALL_BLOOD_GROUPS.map((grp) => (
              <tr key={grp} className={selectedGroup === grp ? 'bg-rose-50/60 font-bold' : ''}>
                <td className="py-3 px-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-red-100 text-red-800 font-black">
                    {grp}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700">
                  {CAN_DONATE_TO_MAP[grp].join(', ')}
                </td>
                <td className="py-3 px-3 text-slate-700">
                  {COMPATIBLE_DONORS_MAP[grp].join(', ')}
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {grp === 'O-' ? 'Universal Red Cell Donor' : grp === 'AB+' ? 'Universal Red Cell Recipient' : 'Common Volunteer'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
