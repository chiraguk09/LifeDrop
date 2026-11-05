export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  whatsapp?: string;
  email?: string;
  nationality: string;
  town: string;
  city: string;
  state: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  heightCm: number;
  weightKg: number;
  isAvailable: boolean;
  lastDonationDate: string | null; // YYYY-MM-DD
  isVerified: boolean;
  verificationBadgeType: 'Gold LifeSaver' | 'Verified Donor' | 'Community Hero';
  totalDonations: number;
  registeredAt: string;
  notes?: string;
  distanceKm?: number;
}

export interface VolunteerPledge {
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorBloodGroup: BloodGroup;
  pledgedAt: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  address: string;
  town: string;
  city: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  urgency: UrgencyLevel;
  reason: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';
  createdAt: string;
  volunteers: VolunteerPledge[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: 'donor' | 'recipient' | 'guest';
  bloodGroup?: BloodGroup;
  town?: string;
  city?: string;
  donorId?: string;
}
