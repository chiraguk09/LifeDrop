import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  AlertCircle, 
  Hospital, 
  MapPin, 
  Phone, 
  User, 
  Droplet,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { BloodGroup, UrgencyLevel, BloodRequest } from '../types';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'volunteers'>) => void;
  defaultBloodGroup?: BloodGroup;
  defaultTown?: string;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultBloodGroup = 'O+',
  defaultTown = '',
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(defaultBloodGroup);
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalName, setHospitalName] = useState('');
  const [town, setTown] = useState(defaultTown || 'Springfield');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('Illinois');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please provide the patient name.');
      return;
    }
    if (!hospitalName.trim()) {
      setError('Please provide the hospital or clinic name.');
      return;
    }
    if (!town.trim()) {
      setError('Please specify the town or locality.');
      return;
    }
    if (!contactPhone.trim()) {
      setError('Please provide a working emergency contact phone number.');
      return;
    }

    setError('');
    onSubmit({
      patientName: patientName.trim(),
      bloodGroup,
      unitsNeeded,
      hospitalName: hospitalName.trim(),
      town: town.trim(),
      city: city.trim() || town.trim(),
      state: state.trim() || 'Active Region',
      address: address.trim() || `${hospitalName}, ${town}`,
      contactPerson: contactPerson.trim() || 'Hospital Attendant',
      contactPhone: contactPhone.trim(),
      urgency,
      reason: reason.trim() || 'Emergency blood requirement for medical treatment.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        
        {/* Header Strip */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Emergency Blood Requirement
              </h2>
              <p className="text-xs text-rose-100">
                Alerts verified voluntary donors in your town immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Patient & Blood Requirement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-red-600" />
              <span>1. Blood & Patient Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe (or Child / Ward)"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {BLOOD_GROUPS.map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units (Pints) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((u) => (
                      <option key={u} value={u}>{u} {u === 1 ? 'Unit' : 'Units'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hospital & Location in Town */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-red-600" />
              <span>2. Hospital & Town Location</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Clinic / Medical Center <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. City General Hospital, Emergency Trauma Wing"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Town / Locality / Neighborhood <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      placeholder="e.g. Oakwood West, Downtown..."
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Springfield"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Ward / Room / Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 3rd Floor, ICU Bed 14, Main Healthcare Ave"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Urgency */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-red-600" />
              <span>3. Contact & Urgency Level</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Attendant / Family Name
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Dr. Adams or Mary (Sister)"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 901-4433"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Urgency selector buttons */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CRITICAL', label: 'CRITICAL (Immediate)', desc: 'Needed in 1-4 hours' },
                  { id: 'URGENT', label: 'URGENT (Today)', desc: 'Needed in 12 hours' },
                  { id: 'STANDARD', label: 'SCHEDULED', desc: 'Planned in 24-48 hrs' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as UrgencyLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      urgency === u.id
                        ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/30'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black">{u.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{u.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Reason */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medical Reason / Notes for Donors
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Road accident trauma, pediatric surgery, dengue platelet count drop..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Broadcast Emergency Request</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
