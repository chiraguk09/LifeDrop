import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Phone, 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Hospital, 
  Heart,
  Send,
  Users
} from 'lucide-react';
import { BloodRequest, Donor } from '../types';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BloodRequest | null;
  matchedDonors: Donor[];
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  request,
  matchedDonors,
}) => {
  if (!isOpen || !request) return null;

  const handleShareWhatsApp = () => {
    const text = `🚨 *EMERGENCY BLOOD REQUIRED IMMEDIATELY* 🚨\n\nPatient: *${request.patientName}*\nBlood Group: *${request.bloodGroup}* (${request.unitsNeeded} Units)\nHospital: *${request.hospitalName}*\nTown/City: *${request.town}, ${request.city}*\nAddress: ${request.address}\nUrgency: *${request.urgency}*\nContact Person: ${request.contactPerson}\nPhone: *${request.contactPhone}*\n\nPlease share with blood donors in ${request.town} and surrounding areas!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Urgent Broadcast Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  Emergency Broadcast Dispatched!
                </h2>
                <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-rose-100">
                {matchedDonors.length} compatible voluntary donors in {request.town} notified
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

        {/* Modal Scroll Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Requisition Summary Card */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-red-700">
                Patient Requirement
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                {request.unitsNeeded} Units of {request.bloodGroup}
              </span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {request.patientName} at {request.hospitalName}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{request.address}, {request.town}, {request.city}</span>
            </div>
            <div className="text-xs text-slate-700 font-medium pt-1">
              Contact: <strong>{request.contactPerson}</strong> ({request.contactPhone})
            </div>
          </div>

          {/* Quick WhatsApp Share Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-emerald-900 text-center sm:text-left">
              <strong className="block font-bold text-sm">Amplify on WhatsApp Community Groups</strong>
              Share this emergency card instantly to neighborhood & town family groups.
            </div>
            <button
              onClick={handleShareWhatsApp}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          {/* Available Local Donors You Can Call Right Now */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-600" />
                <span>Call Nearby Verified Donors Directly:</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {matchedDonors.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {matchedDonors.slice(0, 5).map((donor) => (
                <div
                  key={donor.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {donor.bloodGroup}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {donor.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{donor.town} (~{donor.distanceKm || '2.5'} km)</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{donor.verificationBadgeType}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${donor.phone.replace(/[^0-9+]/g, '')}`}
                    className="shrink-0 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Call {donor.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Next Steps */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-slate-800">What to do next:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Keep the patient's hospital sample blood tubes ready for cross-matching.</li>
              <li>Provide exact room / ward details when the voluntary donor arrives.</li>
              <li>Donation is 100% voluntary and free of charge.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
          >
            Done / Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
