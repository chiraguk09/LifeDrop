import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Sparkles, 
  Info,
  CheckCircle2,
  Users,
  AlertCircle,
  Layers,
  Phone
} from 'lucide-react';
import { Donor, BloodGroup, BloodRequest, UserProfile } from '../types';
import { DonorCard } from './DonorCard';
import { PatientRequestCard } from './PatientRequestCard';
import { isDonorCompatible, getCompatibleDonorGroups } from '../utils/compatibility';

interface FindDonorsProps {
  donors: Donor[];
  requests: BloodRequest[];
  searchParams: {
    bloodGroup: BloodGroup;
    units: number;
    town: string;
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    bloodGroup: BloodGroup;
    units: number;
    town: string;
  }>>;
  onOpenPostRequest: () => void;
  onSendAlert: (donor: Donor) => void;
  onVolunteer: (requestId: string, donorName: string, donorPhone: string, donorBloodGroup: BloodGroup) => void;
  currentUser: UserProfile | null;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const FindDonors: React.FC<FindDonorsProps> = ({
  donors,
  requests,
  searchParams,
  setSearchParams,
  onOpenPostRequest,
  onSendAlert,
  onVolunteer,
  currentUser,
}) => {
  // View selector: 'ALL' | 'REQUESTS' | 'DONORS'
  const [activeViewMode, setActiveViewMode] = useState<'ALL' | 'REQUESTS' | 'DONORS'>('ALL');
  const [includeCompatible, setIncludeCompatible] = useState<boolean>(true);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'distance' | 'donations'>('distance');

  // Pledge modal state for volunteering directly from the patient cards
  const [volunteerModalRequest, setVolunteerModalRequest] = useState<BloodRequest | null>(null);
  const [volunteerName, setVolunteerName] = useState(currentUser?.name || '');
  const [volunteerPhone, setVolunteerPhone] = useState(currentUser?.phone || '');
  const [volunteerBlood, setVolunteerBlood] = useState<BloodGroup>(currentUser?.bloodGroup || 'O+');

  const compatibleGroups = useMemo(() => {
    return getCompatibleDonorGroups(searchParams.bloodGroup);
  }, [searchParams.bloodGroup]);

  // Filter Urgent Patient Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Blood Group matching
      if (searchParams.bloodGroup) {
        if (includeCompatible) {
          // If a patient needs this blood group or is compatible
          const isMatch = req.bloodGroup === searchParams.bloodGroup || isDonorCompatible(searchParams.bloodGroup, req.bloodGroup);
          if (!isMatch) return false;
        } else {
          if (req.bloodGroup !== searchParams.bloodGroup) return false;
        }
      }

      // Town / City search
      if (searchParams.town.trim()) {
        const query = searchParams.town.trim().toLowerCase();
        const inTown = req.town.toLowerCase().includes(query);
        const inCity = req.city.toLowerCase().includes(query);
        const inHospital = req.hospitalName.toLowerCase().includes(query);
        const inAddress = req.address.toLowerCase().includes(query);
        if (!inTown && !inCity && !inHospital && !inAddress) return false;
      }

      return true;
    });
  }, [requests, searchParams, includeCompatible]);

  // Filter Donors based on blood group compatibility, town/city, verification, availability
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Blood group matching
      if (includeCompatible) {
        if (!isDonorCompatible(donor.bloodGroup, searchParams.bloodGroup)) {
          return false;
        }
      } else {
        if (donor.bloodGroup !== searchParams.bloodGroup) {
          return false;
        }
      }

      // Town search match
      if (searchParams.town.trim()) {
        const query = searchParams.town.trim().toLowerCase();
        const inTown = donor.town.toLowerCase().includes(query);
        const inCity = donor.city.toLowerCase().includes(query);
        const inAddress = donor.address.toLowerCase().includes(query);
        if (!inTown && !inCity && !inAddress) {
          return false;
        }
      }

      // Verified filter
      if (onlyVerified && !donor.isVerified) {
        return false;
      }

      // Available filter
      if (onlyAvailable && !donor.isAvailable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm || 99) - (b.distanceKm || 99);
      }
      return b.totalDonations - a.totalDonations;
    });
  }, [donors, searchParams, includeCompatible, onlyVerified, onlyAvailable, sortBy]);

  const handleOpenVolunteerModal = (req: BloodRequest) => {
    setVolunteerModalRequest(req);
    if (currentUser) {
      setVolunteerName(currentUser.name);
      setVolunteerPhone(currentUser.phone);
      if (currentUser.bloodGroup) setVolunteerBlood(currentUser.bloodGroup);
    }
  };

  const handleConfirmPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerModalRequest) return;
    if (!volunteerName.trim() || !volunteerPhone.trim()) return;

    onVolunteer(
      volunteerModalRequest.id,
      volunteerName.trim(),
      volunteerPhone.trim(),
      volunteerBlood
    );
    setVolunteerModalRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search & Location Filter Dashboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>24×7 Community Blood Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Urgent Blood Requisitions & Verified Donors
            </h2>
            <p className="mt-1 text-slate-600 text-sm sm:text-base max-w-2xl">
              See who requires blood urgently in your town and connect with ready voluntary blood donors in real time.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenPostRequest}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Broadcast Emergency Request</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Blood Group
            </label>
            <select
              value={searchParams.bloodGroup}
              onChange={(e) => setSearchParams(prev => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              {BLOOD_GROUPS.map((grp) => (
                <option key={grp} value={grp}>
                  {grp} {grp === 'O-' ? '(Universal Donor)' : grp === 'AB+' ? '(Universal Recipient)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Units needed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Units Filter
            </label>
            <select
              value={searchParams.units}
              onChange={(e) => setSearchParams(prev => ({ ...prev, units: Number(e.target.value) }))}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((u) => (
                <option key={u} value={u}>
                  {u} {u === 1 ? 'Unit (Pint)' : 'Units (Pints)'}
                </option>
              ))}
            </select>
          </div>

          {/* Town / City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Town / City / Area
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchParams.town}
                onChange={(e) => setSearchParams(prev => ({ ...prev, town: e.target.value }))}
                placeholder="Search town or city..."
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sort Donors By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'donations')}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="distance">Nearest Distance (km)</option>
              <option value="donations">Most Experienced Donors</option>
            </select>
          </div>

        </div>

        {/* Toggles */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeCompatible}
                onChange={(e) => setIncludeCompatible(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm focus:ring-red-500 border-slate-300"
              />
              <span>Include Compatible Groups ({compatibleGroups.join(', ')})</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm focus:ring-red-500 border-slate-300"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Donors Only
              </span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm focus:ring-red-500 border-slate-300"
              />
              <span>Available to Donate Today</span>
            </label>
          </div>
        </div>
      </div>

      {/* DUAL VIEW SWITCHER: All / Urgent Patients / Available Donors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveViewMode('ALL')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeViewMode === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Show Both (Patients & Donors)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('REQUESTS')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeViewMode === 'REQUESTS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>🚨 Who Requires Blood Urgently</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeViewMode === 'REQUESTS' ? 'bg-white text-red-600' : 'bg-red-100 text-red-800'
            }`}>
              {filteredRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveViewMode('DONORS')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeViewMode === 'DONORS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>❤️ Verified Donors Ready</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeViewMode === 'DONORS' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-800'
            }`}>
              {filteredDonors.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-2 text-center sm:text-right">
          Found <strong className="text-red-600">{filteredRequests.length}</strong> patient needs & <strong className="text-slate-900">{filteredDonors.length}</strong> available donors
        </div>
      </div>

      {/* SECTION 1: WHO REQUIRES BLOOD URGENTLY (Patients) */}
      {(activeViewMode === 'ALL' || activeViewMode === 'REQUESTS') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Who Requires Blood Urgently</span>
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                  {filteredRequests.length} Critical Requisitions
                </span>
              </h3>
            </div>
            <button
              onClick={onOpenPostRequest}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>+ Post Emergency Need</span>
            </button>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map((req) => (
                <PatientRequestCard
                  key={req.id}
                  request={req}
                  onVolunteer={handleOpenVolunteerModal}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-900 text-sm">
                No Critical Blood Requisitions Matching "{searchParams.town || 'All Towns'}"
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active hospital blood requests are currently pending for this filter. If you or someone you know needs blood, broadcast a request right now!
              </p>
              <button
                onClick={onOpenPostRequest}
                className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Post Emergency Blood Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: VERIFIED BLOOD DONORS AVAILABLE */}
      {(activeViewMode === 'ALL' || activeViewMode === 'DONORS') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Verified Voluntary Blood Donors Available</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredDonors.length} Ready in Town
                </span>
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Direct phone contact & verified health checks
            </span>
          </div>

          {filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  targetBloodGroup={searchParams.bloodGroup}
                  onSendAlert={onSendAlert}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <div className="font-bold text-slate-900 text-sm">
                No Registered Donors in "{searchParams.town || 'selected area'}"
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your town search or broadcast an emergency alert to notify donors in neighboring districts.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Volunteer Pledge Modal */}
      {volunteerModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Volunteer to Donate</h3>
                <p className="text-xs text-slate-500">
                  Pledge blood for {volunteerModalRequest.patientName} at {volunteerModalRequest.hospitalName}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmPledge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Phone Number (For Hospital Attendant)
                </label>
                <input
                  type="tel"
                  required
                  value={volunteerPhone}
                  onChange={(e) => setVolunteerPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-8901"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Blood Group
                </label>
                <select
                  value={volunteerBlood}
                  onChange={(e) => setVolunteerBlood(e.target.value as BloodGroup)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVolunteerModalRequest(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
                >
                  Confirm Blood Donation Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
