import React from 'react';
import { 
  Hospital, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Share2, 
  AlertCircle, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { BloodRequest } from '../types';

interface PatientRequestCardProps {
  request: BloodRequest;
  onVolunteer: (request: BloodRequest) => void;
}

export const PatientRequestCard: React.FC<PatientRequestCardProps> = ({
  request,
  onVolunteer,
}) => {
  const isCritical = request.urgency === 'CRITICAL';
  const pledgedCount = request.volunteers.length;
  const isFull = pledgedCount >= request.unitsNeeded;

  const handleShareWhatsApp = () => {
    const text = `🚨 *URGENT BLOOD REQUIRED* 🚨\nPatient: *${request.patientName}*\nBlood Group: *${request.bloodGroup}* (${request.unitsNeeded} Units needed)\nHospital: *${request.hospitalName}*\nTown/City: *${request.town}, ${request.city}*\nAddress: ${request.address}\nUrgency: *${request.urgency}*\nReason: ${request.reason}\nContact: *${request.contactPhone}* (${request.contactPerson})\nPlease share with blood donors! Verified via LifeDrop.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className={`relative bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-lg ${
      isCritical
        ? 'border-red-300 ring-1 ring-red-100 hover:border-red-400'
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Top Urgency Header */}
      <div className={`px-5 py-3 border-b flex items-center justify-between text-xs ${
        isCritical ? 'bg-red-50/80 border-red-100' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isCritical
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-amber-100 text-amber-800'
          }`}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{request.urgency} REQUIREMENT</span>
          </span>

          <span className="text-slate-500 font-medium hidden sm:inline">
            Posted {formatTimeAgo(request.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs">
          <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
          <span className={isFull ? 'text-emerald-700' : 'text-amber-800'}>
            {pledgedCount} of {request.unitsNeeded} Units Pledged
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          
          {/* Blood Group Display Badge */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-md shadow-red-600/30">
              <span className="text-xl sm:text-2xl font-black leading-none tracking-tight">
                {request.bloodGroup}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 mt-1">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? 'Unit' : 'Units'}
              </span>
            </div>
            <span className="mt-2 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 text-center">
              Blood Needed
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                  Patient Requiring Blood:
                </span>
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {request.patientName}
                </h3>
              </div>
            </div>

            {/* Hospital & Town Location */}
            <div className="mt-1.5 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Hospital className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{request.hospitalName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{request.town}, {request.city}</span>
              </div>
            </div>

            {/* Attendant & Phone */}
            <div className="mt-2 text-xs text-slate-700 font-medium">
              Attendant: <strong className="text-slate-900">{request.contactPerson}</strong>
            </div>
          </div>
        </div>

        {/* Address and Medical Reason */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="text-xs text-slate-600">
            <span className="text-slate-500 font-medium">Hospital Address: </span>
            <span className="text-slate-800 font-medium">{request.address}</span>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 text-xs text-slate-700">
            <strong className="text-red-900">Medical Reason: </strong>
            <span>{request.reason}</span>
          </div>

          {/* Volunteers List */}
          {pledgedCount > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[11px] pt-1">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Pledged Donors:</span>
              </span>
              {request.volunteers.map((vol, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                  {vol.donorName} ({vol.donorBloodGroup})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Direct Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Direct Phone Call Button */}
          <a
            href={`tel:${request.contactPhone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all text-center"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Call: {request.contactPhone}</span>
          </a>

          {/* Volunteer & WhatsApp buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onVolunteer(request)}
              className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-700 border border-rose-200 font-bold text-xs sm:text-sm active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 text-red-600" />
              <span>I Can Donate</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs"
              title="Share Emergency on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
