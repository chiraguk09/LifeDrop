import React, { useState } from 'react';
import { 
  Heart, 
  Droplet, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Scale, 
  Ruler, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodGroup, Donor } from '../types';

interface DonorRegisterProps {
  onRegisterDonor: (donorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations'>) => void;
  onViewDonors: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DonorRegister: React.FC<DonorRegisterProps> = ({
  onRegisterDonor,
  onViewDonors,
}) => {
  // Personal Details
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState<number>(25);
  const [nationality, setNationality] = useState('American');

  // Blood & Physical Details
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [weightKg, setWeightKg] = useState<number>(65);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [lastDonationDate, setLastDonationDate] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  // Contact & Location Details
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [syncWhatsapp, setSyncWhatsapp] = useState(true);
  const [town, setTown] = useState('Oakwood West');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('Illinois');
  const [address, setAddress] = useState('');

  // Verification & Availability
  const [isAvailable, setIsAvailable] = useState(true);
  const [healthConsent, setHealthConsent] = useState(false);
  const [notes, setNotes] = useState('');

  // Form State
  const [error, setError] = useState('');
  const [registeredDonor, setRegisteredDonor] = useState<Donor | null>(null);

  const isWeightValid = weightKg >= 45;
  const isAgeValid = age >= 18 && age <= 65;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a valid emergency phone number so patients can contact you.');
      return;
    }
    if (!town.trim()) {
      setError('Please specify your town address so nearby patients can find you.');
      return;
    }
    if (!address.trim()) {
      setError('Please provide your residential address.');
      return;
    }
    if (!nationality.trim()) {
      setError('Please provide your nationality.');
      return;
    }
    if (!isWeightValid) {
      setError('Safe blood donation requires a minimum body weight of 45-50 kg.');
      return;
    }
    if (!isAgeValid) {
      setError('Voluntary blood donors must be between 18 and 65 years old.');
      return;
    }
    if (!healthConsent) {
      setError('Please confirm the safe donor health declaration.');
      return;
    }

    setError('');

    const newDonorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations'> = {
      name: name.trim(),
      bloodGroup,
      phone: phone.trim(),
      whatsapp: syncWhatsapp ? phone.trim() : (whatsapp.trim() || phone.trim()),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@lifedrop.community`,
      nationality: nationality.trim(),
      town: town.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      gender,
      age,
      heightCm,
      weightKg,
      isAvailable,
      lastDonationDate: isFirstTime ? null : (lastDonationDate || null),
      isVerified: true,
      verificationBadgeType: 'Verified Donor',
      notes: notes.trim() || 'Voluntary donor verified by community network.',
      distanceKm: 1.5,
    };

    onRegisterDonor(newDonorData);

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f43f5e', '#10b981', '#3b82f6'],
    });

    setRegisteredDonor({
      ...newDonorData,
      id: `donor-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      totalDonations: isFirstTime ? 0 : 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Registration Success Screen */}
      {registeredDonor ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Voluntary Donor Badge Awarded
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Welcome to the Network, {registeredDonor.name}!
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              You are now officially registered as an active voluntary blood donor in <strong className="text-slate-900">{registeredDonor.town}, {registeredDonor.city}</strong>. Your profile is live and ready to save lives.
            </p>
          </div>

          {/* Digital Donor ID Card Preview */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 shadow-2xl text-left border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Droplet className="w-40 h-40 fill-white" />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest uppercase">LifeDrop Network</div>
                  <div className="text-[10px] text-slate-400">Official Voluntary Donor Pass</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified ✓
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-black">{registeredDonor.name}</div>
                <div className="text-xs text-slate-300">
                  {registeredDonor.gender} • {registeredDonor.age} yrs • {registeredDonor.nationality}
                </div>
                <div className="text-xs text-rose-300 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{registeredDonor.town}, {registeredDonor.city}</span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-lg">
                <span className="text-2xl">{registeredDonor.bloodGroup}</span>
                <span className="text-[9px] uppercase tracking-wider text-rose-200">Blood</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Weight</div>
                <div className="font-bold">{registeredDonor.weightKg} kg</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Height</div>
                <div className="font-bold">{registeredDonor.heightCm} cm</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[10px] text-slate-400">Status</div>
                <div className="font-bold text-emerald-400">Active Ready</div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-400 text-center">
              Phone: {registeredDonor.phone} • Residential: {registeredDonor.address}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onViewDonors}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all"
            >
              View Donor Directory
            </button>
            <button
              onClick={() => {
                setRegisteredDonor(null);
                setName('');
                setPhone('');
                setAddress('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Register Another Volunteer
            </button>
          </div>
        </div>
      ) : (
        /* Main Registration Form */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 fill-red-600" />
              <span>Free Community Voluntary Registration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Register as a Voluntary Blood Donor
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Join thousands of everyday heroes in urban neighborhoods and rural towns. When someone nearby is in critical need of blood, our platform securely connects them with your phone number and location.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-black">1</span>
                  <span>Personal Details</span>
                </h3>
                <span className="text-xs text-slate-400">All fields required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. American, Indian, Canadian..."
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                          gender === g
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Age (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Must be 18 to 65 years old for voluntary donation.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Blood Group & Physical Details */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-black">2</span>
                  <span>Blood Group & Physical Fitness</span>
                </h3>
              </div>

              {/* Blood Group Select Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Your Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BLOOD_GROUPS.map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setBloodGroup(grp)}
                      className={`h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${
                        bloodGroup === grp
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105'
                          : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-red-300'
                      }`}
                    >
                      <span className="text-lg leading-none">{grp}</span>
                      <span className="text-[9px] uppercase tracking-wider mt-1 opacity-80">
                        {grp === 'O-' ? 'Universal' : 'Type'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical details: Weight and Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Body Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] font-bold ${isWeightValid ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isWeightValid ? '✓ Eligible (≥ 45 kg)' : '✗ Below 45 kg minimum'}
                    </span>
                  </div>
                  <div className="relative">
                    <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={40}
                      max={180}
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      placeholder="e.g. 65"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={120}
                      max={230}
                      required
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      placeholder="e.g. 172"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Last Donation Date */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>When was your last blood donation?</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFirstTime}
                      onChange={(e) => setIsFirstTime(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded-sm focus:ring-red-500"
                    />
                    <span>I am a first-time donor</span>
                  </label>
                </div>

                {!isFirstTime && (
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                )}
              </div>
            </div>

            {/* Step 3: Contact & Town Address (Crucial for user matching) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-black">3</span>
                  <span>Contact Number & Town Address</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number (Direct Calling) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 234-8901"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Patients in urgent need will call this number directly.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      WhatsApp Number
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncWhatsapp}
                        onChange={(e) => setSyncWhatsapp(e.target.checked)}
                        className="w-3.5 h-3.5 text-emerald-600 rounded-sm focus:ring-emerald-500"
                      />
                      <span>Same as phone</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    disabled={syncWhatsapp}
                    value={syncWhatsapp ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +1 (555) 234-8901"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium disabled:opacity-60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Town Address, City, State, Residential Street */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Town / Village / Suburb <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      placeholder="e.g. Oakwood West"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City / District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Springfield"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Illinois"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Residential Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House No. 442, Elm Ridge Road, Near Community Park"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Optional Volunteer Note for Patients
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Available after 5 PM on weekdays and anytime on weekends."
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Step 4: Verification & Consent */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-black">4</span>
                  <span>Safety Consent & Donor Verification</span>
                </h3>
              </div>

              <div className="bg-rose-50/60 rounded-2xl p-4 sm:p-5 border border-rose-200/80 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={healthConsent}
                    onChange={(e) => setHealthConsent(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-red-600 rounded-sm focus:ring-red-500 border-slate-300"
                  />
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong>Safe Donor Declaration:</strong> I confirm that I am in good overall health, free from infectious transmissible diseases, fever, or recent major surgery, and I volunteer freely to help individuals requiring emergency blood transfusions in my community.
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-red-600 rounded-sm focus:ring-red-500 border-slate-300"
                  />
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong>Active Emergency Availability:</strong> Keep my phone number active and visible to verified emergency patients and local hospital attendants.
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-base shadow-xl shadow-red-600/25 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Complete Registration & Get Verified</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
