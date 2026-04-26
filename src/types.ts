export type AssetType = 
  | 'Laptop' | 'Desktop' | 'Mouse' | 'Keyboard' | 'Monitor' | 'Printer' 
  | 'Headset' | 'Mobile' | 'Tablet' | 'Server' | 'Network Device' | 'Other';

export type CategoryType = 'Permanent' | 'Temporary' | 'Rental' | 'Replacement' | 'Spare' | 'Other';

export type LocationType = 
  | 'iTest Content Room' | 'Outside Employee' | 'Outside Client' 
  | 'Office' | 'Store Room' | 'Other';

export type SubmissionStatusType = 
  | 'Already Done' | 'In Process' | 'With iTest Team' 
  | 'Pending' | 'Not Submitted' | 'Other';

export type VerificationStatusType = 
  | 'Verified' | 'Pending Verification' | 'Mismatch Found' 
  | 'Not Verified' | 'Rejected' | 'Other';

export interface Asset {
  id?: string;
  asset_id: string; // Unique Identifier
  asset_name: string;
  type: AssetType;
  category: CategoryType;
  ref_no: string;
  model: string;
  serial_number: string;
  host_name: string;
  assigned_to: string;
  use_by: string;
  location: LocationType;
  submission_status: SubmissionStatusType;
  verification_status: VerificationStatusType;
  asset_mapped: string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export const ASSET_TYPES: AssetType[] = [
  'Laptop', 'Desktop', 'Mouse', 'Keyboard', 'Monitor', 'Printer', 
  'Headset', 'Mobile', 'Tablet', 'Server', 'Network Device', 'Other'
];

export const CATEGORIES: CategoryType[] = [
  'Permanent', 'Temporary', 'Rental', 'Replacement', 'Spare', 'Other'
];

export const LOCATIONS: LocationType[] = [
  'iTest Content Room', 'Outside Employee', 'Outside Client', 'Office', 'Store Room', 'Other'
];

export const SUBMISSION_STATUSES: SubmissionStatusType[] = [
  'Already Done', 'In Process', 'With iTest Team', 'Pending', 'Not Submitted', 'Other'
];

export const VERIFICATION_STATUSES: VerificationStatusType[] = [
  'Verified', 'Pending Verification', 'Mismatch Found', 'Not Verified', 'Rejected', 'Other'
];
