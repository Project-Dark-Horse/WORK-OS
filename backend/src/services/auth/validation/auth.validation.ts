import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['JOB_SEEKER', 'JOB_POSTER']),
  // Optional fields based on role
  company: z.string().optional(),
  companyDescription: z.string().optional(),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;