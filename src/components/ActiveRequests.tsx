import React, { useState } from 'react';
import { 
  AlertCircle, 
  Hospital, 
  MapPin, 
  Phone, 
  User, 
  Droplet, 
  Heart, 
  Share2, 
  Clock, 
  CheckCircle2, 
  Filter,
  Plus
} from 'lucide-react';
import { BloodRequest, BloodGroup, UserProfile } from '../types';

interface ActiveRequestsProps {
  requests: BloodRequest[];
  currentUser: UserProfile | null;
  onVolunteer: (requestId: string, donorName: string, donorPhone: string, donorBloodGroup: BloodGroup) => void;
  onOpenPostRequest: () => void;
  onOpenAuth: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ActiveRequests: React.FC<ActiveRequestsProps> = ({
  requests,
  currentUser,
  onVolunteer,
  onOpenPostRequest,
  onOpenAuth,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchTown, setSearchTown] = useState<string>('');
  const [pledgeModalRequestId, setPledgeModalRequestId] = useState<string | null>(null);
  const [volunteerName, setVolunteerName] = useState(currentUser?.name || '');
  const [volunteerPhone, setVolunteerPhone] = useState(currentUser?.phone || '');
  const [volunteerBlood, setVolunteerBlood] = useState<BloodGroup>(currentUser?.bloodGroup || 'O+');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (selectedGroup !== 'ALL' && req.bloodGroup !== selectedGroup) return false;
    if (searchTown.trim()) {
      const q = searchTown.trim().toLowerCase();
      const inTown = req.town.toLowerCase().includes(q);
      const inCity = req.city.toLowerCase().includes(q);
      const inHospital = req.hospitalName.toLowerCase().includes(q);
      if (!inTown && !inCity && !inHospital) return false;
    }
    return true;
  });

  const handleShare = (req: BloodRequest) => {
    const text = `🚨 *URGENT BLOOD REQUIRED* 🚨\nPatient: ${req.patientName}\nBlood Group: *${req.bloodGroup}* (${req.unitsNeeded} Units needed)\nHospital: ${req.hospitalName}, ${req.town}, ${req.city}\nUrgency: ${req.urgency}\nContact: ${req.contactPhone} (${req.contactPerson})\nPlease share and help save a life! Verified via LifeDrop Community.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeModalRequestId) return;
    if (!volunteerName.trim() || !volunteerPhone.trim()) return;

    onVolunteer(pledgeModalRequestId, volunteerName.trim(), volunteerPhone.trim(), volunteerBlood);
    setPledgeModalRequestId(null);
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span>Live Emergency Blood Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Urgent Patient Blood Requisitions
          </h2>
          <p className="mt-1 text-slate-600 text-sm sm:text-base max-w-2xl">
            Real-time critical requirements from hospitals and families across towns. If you are eligible, click to volunteer and coordinate direct transfusion.
          </p>
        </div>

        <button
          onClick={onOpenPostRequest}
          className="shrink-0 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Blood Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        {/* Blood Group Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Group:</span>
          </span>
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'ALL'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Types ({requests.length})
          </button>
          {BLOOD_GROUPS.map((grp) => {
            const count = requests.filter(r => r.bloodGroup === grp).length;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGroup === grp
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {grp} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Search input for town */}
        <div className="w-full sm:w-64">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTown}
              onChange={(e) => setSearchTown(e.target.value)}
              placeholder="Filter by town / hospital..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Active Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const isCritical = req.urgency === 'CRITICAL';
            const pledgedCount = req.volunteers.length;
            const isFull = pledgedCount >= req.unitsNeeded;

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-xs hover:shadow-md ${
                  isCritical 
                    ? 'border-red-300 ring-1 ring-red-200/50' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  
                  {/* Left: Blood Group & Details */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* Big Blood Badge */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-md ${
                        isCritical 
                          ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-500/25' 
                          : 'bg-gradient-to-br from-slate-800 to-slate-900'
                      }`}>
                        <span className="text-2xl sm:text-3xl leading-none">{req.bloodGroup}</span>
                        <span className="text-[10px] uppercase font-bold text-rose-200 mt-1">
                          {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'}
                        </span>
                      </div>
                      <span className="mt-2 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(req.createdAt)}</span>
                      </span>
                    </div>

                    {/* Patient & Hospital Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          isCritical
                            ? 'bg-red-100 text-red-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.urgency} Requirement
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isFull 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {pledgedCount} of {req.unitsNeeded} units pledged
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {req.patientName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <Hospital className="w-3.5 h-3.5 text-red-500" />
                          <span>{req.hospitalName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.town}, {req.city}</span>
                        </div>
                        <div className="text-slate-500">
                          Address: {req.address}
                        </div>
                      </div>

                      {/* Reason */}
                      <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                        <strong className="text-slate-900">Medical Reason:</strong> {req.reason}
                      </p>

                      {/* Volunteers list */}
                      {pledgedCount > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="font-semibold text-emerald-700">Pledged Volunteers:</span>
                          {req.volunteers.map((vol, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                              ✓ {vol.donorName} ({vol.donorBloodGroup})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
                    
                    {/* Call Attendant directly */}
                    <a
                      href={`tel:${req.contactPhone.replace(/[^0-9+]/g, '')}`}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all text-center"
                    >
                      <Phone className="w-4 h-4 fill-white" />
                      <span>Call Attendant: {req.contactPhone}</span>
                    </a>

                    {/* Volunteer to Donate Button */}
                    <button
                      onClick={() => {
                        setPledgeModalRequestId(req.id);
                        if (currentUser) {
                          setVolunteerName(currentUser.name);
                          setVolunteerPhone(currentUser.phone);
                          if (currentUser.bloodGroup) setVolunteerBlood(currentUser.bloodGroup);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-700 border border-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-600" />
                      <span>Volunteer to Donate</span>
                    </button>

                    {/* Share to WhatsApp */}
                    <button
                      onClick={() => handleShare(req)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-md mx-auto space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Open Requests for this Filter</h3>
            <p className="text-xs text-slate-500">
              There are no active emergency blood requirements matching this blood group or town.
            </p>
          </div>
        )}
      </div>

      {/* Volunteer Pledge Modal */}
      {pledgeModalRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Volunteer to Donate</h3>
                <p className="text-xs text-slate-500">Coordinate directly with the hospital attendant</p>
              </div>
            </div>

            <form onSubmit={handlePledgeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name
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
                  Your Phone Number (For Attendant to Call You)
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
                  onClick={() => setPledgeModalRequestId(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
                >
                  Confirm Blood Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
