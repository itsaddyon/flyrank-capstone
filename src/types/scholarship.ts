export type GenderOption = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';

export type CurrentYearOption = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate (Masters/PhD)';

export type CategoryOption = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Other';

export type ScholarshipTypeOption =
  | 'Merit-Based Academic Excellence'
  | 'Need-Based Financial Assistance'
  | 'Women in STEM Leadership'
  | 'Underrepresented Minorities in Tech'
  | 'Research & Innovation Grant';

export interface ScholarshipFormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: GenderOption | '';
  collegeName: string;
  university: string;
  currentYear: CurrentYearOption | '';
  branch: string;
  cgpa: string;
  familyIncome: string;
  category: CategoryOption | '';
  scholarshipType: ScholarshipTypeOption | '';
  statementOfPurpose: string;
  incomeCertificate: File | null;
  marksheet: File | null;
  declared: boolean;
}

export type FormErrors = Partial<Record<keyof ScholarshipFormData, string>>;

export interface SubmissionReceipt {
  applicationId: string;
  submittedAt: string;
  data: ScholarshipFormData;
}
