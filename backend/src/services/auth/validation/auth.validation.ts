// src/services/auth/validation/auth.validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  ),
  name: z.string().min(2),
  role: z.enum(['JOB_SEEKER', 'JOB_POSTER']),
  // Optional fields based on role
  company: z.string().optional(),
  companyDescription: z.string().optional(),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url().optional(),
  portfolio: z.array(z.string()).optional(),
}).refine(data => {
  if (data.role === 'JOB_POSTER') {
    return data.company && data.companyDescription;
  }
  return true;
}, {
  message: "Company and company description are required for job posters"
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const resetPasswordSchema = z.object({
  email: z.string().email()
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;