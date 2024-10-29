import { z } from 'zod';

export const jobSeekerProfileSchema = z.object({
  education: z.string().optional(),
  skills: z.array(z.string()),
  resumeUrl: z.string().url().optional(),
  portfolio: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url()
    })
  ).optional()
});

export const jobPosterProfileSchema = z.object({
  company: z.string(),
  companyDescription: z.string(),
  industry: z.string().optional()
});

export type JobSeekerProfileDto = z.infer<typeof jobSeekerProfileSchema>;
export type JobPosterProfileDto = z.infer<typeof jobPosterProfileSchema>;