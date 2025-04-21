
// User types
export type UserOccupation = 'student' | 'professional';
export type Gender = 'male' | 'female' | 'transgender';
export type StudentType = 'school' | 'college';

export interface UserProfile {
  uid?: string;
  email: string;
  name: string;
  dob: string;
  gender: Gender;
  profilePicture?: string;
  phoneNumber: string;
  occupation: UserOccupation;
  
  // Student specific fields
  studentType?: StudentType;
  schoolName?: string;
  className?: string;
  section?: string;
  classRollNo?: string;
  parentsPhone?: string;
  
  // College specific fields
  collegeName?: string;
  universityRollNo?: string;
  branch?: string;
  collegeSection?: string;
  collegeClassRollNo?: string;
  
  // Professional specific fields
  companyName?: string;
  locality?: string;
  employeeId?: string;
  
  // Metadata
  createdAt?: string;
  lastLoginAt?: string;
}

// Lost Item types
export interface LostItem {
  id?: string;
  createdBy: string;
  image: string;
  category: string;
  lostDate: string;
  description: string;
  phoneNumber: string;
  createdAt?: string;
  
  // Organization specific fields
  organization: string; // school/college/company name
  organizationType: 'school' | 'college' | 'company';
}

// Found Item types
export interface FoundItem {
  id?: string;
  createdBy: string;
  image: string;
  location: string;
  description?: string;
  createdAt?: string;
  
  // Organization specific fields
  organization: string; // school/college/company name
  organizationType: 'school' | 'college' | 'company';
}
