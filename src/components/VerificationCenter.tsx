import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  FileCheck, 
  Phone, 
  UserCheck, 
  Heart,
  Calendar,
  Scale,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationCenterProps {
  onNavigateRegister: () => void;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  onNavigateRegister,
}) => {
  // Self verification quiz state
  const [age, setAge] = useState<number>(26);
  const [weight, setWeight] = useState<number>(64);
  const [monthsSinceLast, setMonthsSinceLast] = useState<number>(4);
  const [hasInfections, setHasInfections] = useState<boolean>(false);
  const [hasTattooRecent, setHasTattooRecent] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Evaluate
  const isEligibleAge = age >= 18 && age <= 65;
  const isEligibleWeight = weight >= 45;
  const isEligibleCooldown = monthsSinceLast >= 3;
  const isHealthy = !hasInfections && !hasTattooRecent;

  const isOverallEligible = isEligibleAge && isEligibleWeight && isEligibleCooldown && isHealthy;

  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSubmitted(true);
    if (isOverallEligible) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#ef4444'],
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Trust & Safety Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Secure Donor Verification System
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          When life hangs in the balance, every second counts. LifeDrop implements a 3-tier safety verification protocol to guarantee that patients connect exclusively with genuine, physically eligible, and available voluntary donors.
        </p>

        {/* 3 Pillars of Verification */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Real Phone & Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every voluntary donor confirms their live telephone number and residential town. Requesters can dial directly without automated bots or call centers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Physical Fitness Filter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict eligibility criteria: weight ≥ 45 kg, age 18-65, and automated 90-day cooldown tracking between donations to protect donor wellness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Community Badging</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors earn verifiable badges (Verified Donor, Community Hero, Gold LifeSaver) based on lifetime donations and rapid responsiveness.
            </p>
          </div>

        </div>
      </div>

      {/* Interactive 1-Minute Eligibility Checker */}
      <div className="bg-gradient-to-br from-white to-rose-50/40 rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-md">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
            <FileCheck className="w-4 h-4" />
            <span>Instant Self-Check Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Check Your Blood Donation Eligibility in 30 Seconds
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Fill in your basic physical parameters to see if you can safely volunteer to donate blood today.
          </p>
        </div>

        <form onSubmit={handleRunCheck} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Age (Years)
              </label>
              <input
                type="number"
                min={15}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Body Weight (kg)
              </label>
              <input
                type="number"
                min={30}
                max={180}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Months Since Last Donation
              </label>
              <input
                type="number"
                min={0}
                max={36}
                value={monthsSinceLast}
                onChange={(e) => setMonthsSinceLast(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Health toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasInfections}
                onChange={(e) => setHasInfections(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm"
              />
              <span className="text-xs text-slate-700">
                I currently have a fever, flu, or active infection
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTattooRecent}
                onChange={(e) => setHasTattooRecent(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm"
              />
              <span className="text-xs text-slate-700">
                I received a tattoo or piercing within the last 6 months
              </span>
            </label>
          </div>

          <div className="flex items-center justify-start gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
            >
              Verify My Eligibility
            </button>
          </div>
        </form>

        {/* Quiz Result */}
        {quizSubmitted && (
          <div className="mt-6 pt-6 border-t border-rose-200">
            {isOverallEligible ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-3">
                <div className="flex items-center gap-2.5 font-black text-base text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>You Are Eligible to Donate Blood Today!</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your age ({age} yrs), body weight ({weight} kg), and safe donation interval ({monthsSinceLast} months) satisfy all national voluntary blood donation guidelines.
                </p>
                <button
                  onClick={onNavigateRegister}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Register Profile with Verified Status
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                <div className="flex items-center gap-2.5 font-bold text-base text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Temporary Ineligibility Detected</span>
                </div>
                <ul className="text-xs text-amber-800 space-y-1 list-disc pl-5">
                  {!isEligibleAge && <li>Age must be between 18 and 65 years.</li>}
                  {!isEligibleWeight && <li>Weight is below the 45 kg safety threshold.</li>}
                  {!isEligibleCooldown && <li>Minimum interval between donations is 3 months (90 days).</li>}
                  {hasInfections && <li>Please rest and recover from your fever/infection before donating.</li>}
                  {hasTattooRecent && <li>Recent tattoo or piercing requires a standard 6-month safety window.</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
