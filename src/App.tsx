import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FindDonors } from './components/FindDonors';
import { DonorRegister } from './components/DonorRegister';
import { ActiveRequests } from './components/ActiveRequests';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { VerificationCenter } from './components/VerificationCenter';
import { PostRequestModal } from './components/PostRequestModal';
import { AuthModal } from './components/AuthModal';
import { EmergencyBroadcastModal } from './components/EmergencyBroadcastModal';
import { Footer } from './components/Footer';

import { Donor, BloodRequest, UserProfile, BloodGroup } from './types';
import { INITIAL_DONORS, INITIAL_REQUESTS, DEMO_USERS } from './data/mockData';
import { isDonorCompatible } from './utils/compatibility';
import { CheckCircle2, Bell, AlertTriangle, X } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('find');

  // Donors State (persisted in localStorage)
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem('lifedrop_donors');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DONORS;
  });

  // Emergency Requests State (persisted in localStorage)
  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    try {
      const saved = localStorage.getItem('lifedrop_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lifedrop_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to the demo donor for easy exploration
    return DEMO_USERS[0];
  });

  // Search Filter State
  const [searchParams, setSearchParams] = useState<{
    bloodGroup: BloodGroup;
    units: number;
    town: string;
  }>({
    bloodGroup: 'O+',
    units: 2,
    town: 'Springfield',
  });

  // Modals
  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [broadcastModalData, setBroadcastModalData] = useState<{
    isOpen: boolean;
    request: BloodRequest | null;
    matchedDonors: Donor[];
  }>({
    isOpen: false,
    request: null,
    matchedDonors: [],
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Donors with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lifedrop_donors', JSON.stringify(donors));
    } catch (e) {
      console.error(e);
    }
  }, [donors]);

  // Sync Requests with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lifedrop_requests', JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  // Sync User with localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('lifedrop_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('lifedrop_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Register New Donor
  const handleRegisterDonor = (newDonorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations'>) => {
    const createdDonor: Donor = {
      ...newDonorData,
      id: `donor-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      totalDonations: 1,
    };

    setDonors((prev) => [createdDonor, ...prev]);

    // Also auto-log in this new donor
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: createdDonor.name,
      phone: createdDonor.phone,
      role: 'donor',
      bloodGroup: createdDonor.bloodGroup,
      town: createdDonor.town,
      city: createdDonor.city,
      donorId: createdDonor.id,
    };
    setCurrentUser(newUser);

    showToast(`Welcome ${createdDonor.name}! Your verified donor profile is active.`);
  };

  // Create & Broadcast New Blood Request
  const handleCreateRequest = (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'volunteers'>) => {
    const newReq: BloodRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      volunteers: [],
    };

    setRequests((prev) => [newReq, ...prev]);
    setIsPostRequestModalOpen(false);

    // Find compatible donors in matching locality
    const matched = donors.filter((d) => {
      const compatible = isDonorCompatible(d.bloodGroup, newReq.bloodGroup);
      const inTown = newReq.town ? d.town.toLowerCase().includes(newReq.town.toLowerCase()) || d.city.toLowerCase().includes(newReq.city.toLowerCase()) : true;
      return compatible && inTown && d.isAvailable;
    });

    setBroadcastModalData({
      isOpen: true,
      request: newReq,
      matchedDonors: matched.length > 0 ? matched : donors.filter(d => isDonorCompatible(d.bloodGroup, newReq.bloodGroup)),
    });

    showToast(`Emergency Broadcast dispatched for ${newReq.patientName}! ${matched.length} donors notified.`);
  };

  // Donor volunteers for a blood request
  const handleVolunteerForRequest = (
    requestId: string,
    donorName: string,
    donorPhone: string,
    donorBloodGroup: BloodGroup
  ) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const alreadyPledged = req.volunteers.some((v) => v.donorPhone === donorPhone);
          if (alreadyPledged) return req;
          return {
            ...req,
            volunteers: [
              ...req.volunteers,
              {
                donorId: `vol-${Date.now()}`,
                donorName,
                donorPhone,
                donorBloodGroup,
                pledgedAt: new Date().toISOString(),
              },
            ],
          };
        }
        return req;
      })
    );

    showToast(`Thank you ${donorName}! Your blood donation pledge has been registered with the hospital.`);
  };

  // Send Direct Alert to Donor
  const handleSendAlertToDonor = (donor: Donor) => {
    showToast(`Emergency Alert Ping sent to ${donor.name} (${donor.phone}). They will receive an SMS notice.`);
  };

  // Quick Hero Search
  const handleHeroSearch = (bloodGroup: BloodGroup, units: number, town: string) => {
    setSearchParams({ bloodGroup, units, town });
    setActiveTab('find');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
        activeRequestsCount={requests.length}
      />

      {/* Hero Section (Displayed on primary landing or find tab) */}
      {activeTab === 'find' && (
        <HeroBanner
          onSearch={handleHeroSearch}
          onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
          onNavigateRegister={() => setActiveTab('register')}
          totalDonorsCount={donors.length}
        />
      )}

      {/* Primary Tab Views */}
      <main className="flex-1">
        {activeTab === 'find' && (
          <FindDonors
            donors={donors}
            requests={requests}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
            onSendAlert={handleSendAlertToDonor}
            onVolunteer={handleVolunteerForRequest}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'requests' && (
          <ActiveRequests
            requests={requests}
            currentUser={currentUser}
            onVolunteer={handleVolunteerForRequest}
            onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'register' && (
          <DonorRegister
            onRegisterDonor={handleRegisterDonor}
            onViewDonors={() => setActiveTab('find')}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationCenter
            onNavigateRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityMatrix />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
      />

      {/* Modals */}
      <PostRequestModal
        isOpen={isPostRequestModalOpen}
        onClose={() => setIsPostRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
        defaultBloodGroup={searchParams.bloodGroup}
        defaultTown={searchParams.town}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => {
          setCurrentUser(u);
          showToast(`Logged in as ${u.name} (${u.role})`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('You have logged out.');
        }}
        onNavigateRegister={() => setActiveTab('register')}
      />

      <EmergencyBroadcastModal
        isOpen={broadcastModalData.isOpen}
        onClose={() => setBroadcastModalData((prev) => ({ ...prev, isOpen: false }))}
        request={broadcastModalData.request}
        matchedDonors={broadcastModalData.matchedDonors}
      />

    </div>
  );
}
