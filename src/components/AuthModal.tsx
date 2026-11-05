import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Droplet, 
  MapPin, 
  LogOut, 
  Check, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { UserProfile, BloodGroup } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateRegister: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onNavigateRegister,
}) => {
  const [role, setRole] = useState<'donor' | 'recipient'>('donor');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [town, setTown] = useState('Oakwood West');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      role,
      bloodGroup: role === 'donor' ? bloodGroup : undefined,
      town: town.trim(),
      city: 'Springfield',
    };

    onLogin(user);
    onClose();
  };

  const handleSelectDemoUser = (demoUser: UserProfile) => {
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {currentUser ? 'Your LifeDrop Account' : 'Login to LifeDrop'}
              </h2>
              <p className="text-xs text-rose-100">
                For voluntary donors and recipients in need
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* If already logged in: Profile Card */}
          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md capitalize">
                    {currentUser.role} Account
                  </span>
                  {currentUser.bloodGroup && (
                    <span className="text-xs font-black text-white bg-red-600 px-2 py-0.5 rounded-md">
                      {currentUser.bloodGroup}
                    </span>
                  )}
                </div>
                <div className="text-lg font-black text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-600">
                  Phone: <strong className="text-slate-800">{currentUser.phone}</strong>
                </div>
                {currentUser.town && (
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{currentUser.town}, {currentUser.city || 'Springfield'}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onLogout();
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of this Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login & Role Selection */
            <div className="space-y-6">
              
              {/* Quick 1-Click Demo Profiles */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  ⚡ 1-Click Quick Demo Sign In:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser(DEMO_USERS[0])}
                    className="p-3 rounded-2xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-left transition-colors"
                  >
                    <div className="text-xs font-black text-red-900">Sarah Jenkins</div>
                    <div className="text-[10px] text-red-700 font-semibold">Donor (O- Universal)</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Oakwood West</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser(DEMO_USERS[1])}
                    className="p-3 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-colors"
                  >
                    <div className="text-xs font-black text-blue-900">David Miller</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Blood Recipient</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Oakwood West</div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] uppercase font-bold text-slate-400 absolute">
                  or sign in with phone
                </span>
              </div>

              {/* Role Toggle */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    role === 'donor'
                      ? 'bg-white text-red-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  I am a Blood Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recipient')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    role === 'recipient'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  I Need Blood (Recipient)
                </button>
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Miller"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {role === 'donor' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Town / Locality
                      </label>
                      <input
                        type="text"
                        value={town}
                        onChange={(e) => setTown(e.target.value)}
                        placeholder="e.g. Oakwood West"
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 active:scale-95 transition-all"
                >
                  Enter LifeDrop
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateRegister();
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  New donor? Complete full voluntary donor registration &rarr;
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
