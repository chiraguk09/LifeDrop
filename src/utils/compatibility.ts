import { BloodGroup } from '../types';

export const COMPATIBLE_DONORS_MAP: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export const CAN_DONATE_TO_MAP: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export function isDonorCompatible(donorGroup: BloodGroup, patientGroup: BloodGroup): boolean {
  const allowedDonors = COMPATIBLE_DONORS_MAP[patientGroup];
  return allowedDonors.includes(donorGroup);
}

export function getCompatibleDonorGroups(patientGroup: BloodGroup): BloodGroup[] {
  return COMPATIBLE_DONORS_MAP[patientGroup] || [];
}

export function getCompatibleRecipientGroups(donorGroup: BloodGroup): BloodGroup[] {
  return CAN_DONATE_TO_MAP[donorGroup] || [];
}

export function calculateCooldownDays(lastDonationDate: string | null): {
  isEligible: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      message: 'Eligible to donate today',
    };
  }

  const lastDate = new Date(lastDonationDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const standardCooldownDays = 90; // 3 months between donations
  if (diffDays >= standardCooldownDays) {
    return {
      isEligible: true,
      daysRemaining: 0,
      message: `Eligible to donate (Last donated ${diffDays} days ago)`,
    };
  } else {
    const remaining = standardCooldownDays - diffDays;
    return {
      isEligible: false,
      daysRemaining: remaining,
      message: `Cooldown active: ${remaining} days until safe to donate`,
    };
  }
}
