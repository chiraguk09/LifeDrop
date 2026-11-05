import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Scale, 
  Ruler, 
  User, 
  Globe, 
  Award,
  Clock,
  Send,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { Donor, BloodGroup } from '../types';
import { calculateCooldownDays, isDonorCompatible } from '../utils/compatibility';

interface DonorCardProps {
  donor: Donor;
  targetBloodGroup?: BloodGroup;
  onSendAlert: (donor: Donor) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  targetBloodGroup,
  onSendAlert,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const cooldown = calculateCooldownDays(donor.lastDonationDate);
  const isCompatible = targetBloodGroup ? isDonorCompatible(donor.bloodGroup, targetBloodGroup) : true;
  const isExactMatch = targetBloodGroup ? donor.bloodGroup === targetBloodGroup : true;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${donor.name},\nI found your voluntary donor profile on LifeDrop. We urgently require ${targetBloodGroup || donor.bloodGroup} blood for a patient. Are you available to help donate? Thank you!`
  );

  return (
    <div className={`relative bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-lg ${
      isExactMatch 
        ? 'border-rose-200 hover:border-red-400' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Top Header Strip with Compatibility / Verification status */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-rose-50/40 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {donor.isVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{donor.verificationBadgeType || 'Verified Donor'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>Verification Pending</span>
            </span>
          )}

          {targetBloodGroup && !isExactMatch && isCompatible && (
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
              Compatible with {targetBloodGroup}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className={`w-2 h-2 rounded-full ${donor.isAvailable && cooldown.isEligible ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="font-semibold text-slate-700">
            {donor.isAvailable && cooldown.isEligible ? 'Available to Donate' : 'On Standby'}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          
          {/* Blood Group Display Badge */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-md shadow-red-600/30">
              <span className="text-xl sm:text-2xl font-black leading-none tracking-tight">
                {donor.bloodGroup}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 mt-1">
                Blood
              </span>
            </div>
            {donor.distanceKm !== undefined && (
              <span className="mt-2 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-center">
                ~{donor.distanceKm} km away
              </span>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {donor.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                <Award className="w-3.5 h-3.5" />
                <span>{donor.totalDonations} Donations</span>
              </div>
            </div>

            {/* Town & Location details */}
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-semibold text-slate-800">{donor.town}</span>
              <span className="text-slate-400">•</span>
              <span className="truncate">{donor.city}, {donor.state}</span>
            </div>

            {/* Quick stats: Gender, Age, Weight, Nationality */}
            <div className="mt-2.5 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <User className="w-3 h-3 text-slate-400" />
                <span>{donor.gender}, {donor.age} yrs</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Scale className="w-3 h-3 text-slate-400" />
                <span>{donor.weightKg} kg</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Ruler className="w-3 h-3 text-slate-400" />
                <span>{donor.heightCm} cm</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>{donor.nationality}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Address and Eligibility Preview */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-start justify-between gap-2 text-xs text-slate-600">
            <span className="text-slate-500 shrink-0 font-medium">Residential Address:</span>
            <span className="text-slate-800 font-medium text-right truncate" title={donor.address}>
              {donor.address}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Last Donated:</span>
            <span className={`font-semibold ${cooldown.isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
              {cooldown.message}
            </span>
          </div>

          {donor.notes && (
            <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
              "{donor.notes}"
            </p>
          )}
        </div>

        {/* Direct Connect & Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Direct Phone Call Button */}
          <a
            href={`tel:${donor.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all text-center"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Call: {donor.phone}</span>
          </a>

          {/* WhatsApp / Message Button */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${(donor.whatsapp || donor.phone).replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-xs"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Copy phone number button */}
            <button
              onClick={handleCopyPhone}
              className="px-3 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Copy Phone Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Rapid In-App Alert */}
            <button
              onClick={() => onSendAlert(donor)}
              className="px-3 h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-600 border border-rose-200 flex items-center justify-center transition-colors"
              title="Send Emergency In-App Ping"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
