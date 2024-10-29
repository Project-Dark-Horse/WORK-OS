import { Response } from 'express';
import { JobPosterService } from '../services/job-poster.service';
import { jobPosterProfileSchema } from '../validation/user.validation';
import { AuthRequest } from '../../auth/middleware/auth.middleware';

export class JobPosterController {
  private jobPosterService: JobPosterService;

  constructor() {
    this.jobPosterService = new JobPosterService();
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const profile = await this.jobPosterService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const validatedData = jobPosterProfileSchema.parse(req.body);
      const updatedProfile = await this.jobPosterService.updateProfile(
        userId,
        validatedData
      );
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPostedJobs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const jobs = await this.jobPosterService.getPostedJobs(userId);
      res.json(jobs);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}