import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const INDIAN_PHONE_REGEX = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/;

export const fileSchema = z
  .custom<File>((val) => val instanceof File, { message: 'Document is required' })
  .refine((file) => file instanceof File && file.size > 0, {
    message: 'Document is required'
  })
  .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
    message: 'File size must not exceed 5 MB'
  })
  .refine(
    (file) =>
      file instanceof File &&
      (ALLOWED_MIME_TYPES.includes(file.type) ||
        /\.(pdf|jpg|jpeg|png)$/i.test(file.name)),
    {
      message: 'Allowed formats: PDF, JPG, JPEG, PNG'
    }
  );

export const scholarshipSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full Name is required' })
    .min(3, { message: 'Full Name must be at least 3 characters long' }),

  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),

  phone: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(INDIAN_PHONE_REGEX, {
      message: 'Please enter a valid 10-digit Indian mobile number'
    }),

  dob: z
    .string()
    .min(1, { message: 'Date of Birth is required' })
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      },
      { message: 'Date of Birth cannot be a future date' }
    )
    .refine(
      (val) => {
        const birthDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 17;
      },
      { message: 'Applicant must be at least 17 years old' }
    ),

  gender: z
    .string()
    .min(1, { message: 'Please select a gender' }),

  collegeName: z
    .string()
    .min(1, { message: 'College Name is required' }),

  university: z
    .string()
    .min(1, { message: 'University Name is required' }),

  branch: z
    .string()
    .min(1, { message: 'Branch / Course is required' }),

  currentYear: z
    .string()
    .min(1, { message: 'Please select your current year of study' }),

  cgpa: z
    .string()
    .min(1, { message: 'CGPA is required' })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      { message: 'CGPA must be a valid number between 0 and 10' }
    ),

  scholarshipType: z
    .string()
    .min(1, { message: 'Please select a scholarship type' }),

  category: z
    .string()
    .min(1, { message: 'Please select a category' }),

  familyIncome: z
    .string()
    .min(1, { message: 'Annual family income is required' })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'Annual family income must be a positive number' }
    ),

  statementOfPurpose: z
    .string()
    .min(1, { message: 'Statement of Purpose is required' })
    .refine(
      (val) => {
        const words = val.trim().split(/\s+/).filter(Boolean);
        return words.length <= 250;
      },
      { message: 'Statement of Purpose cannot exceed 250 words' }
    ),

  incomeCertificate: fileSchema,
  marksheet: fileSchema,

  declaration: z.boolean().refine((val) => val === true, {
    message: 'You must accept the declaration to submit'
  })
});

export type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
