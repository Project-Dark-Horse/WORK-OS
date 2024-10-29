import { Response } from 'express';
import { JobSeekerService } from '../services/job-seeker.service';
import { jobSeekerProfileSchema } from '../validation/user.validation';
import { AuthRequest } from '../../auth/middleware/auth.middleware';

export class JobSeekerController {
  private jobSeekerService: JobSeekerService;

  constructor() {
    this.jobSeekerService = new JobSeekerService();
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const profile = await this.jobSeekerService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const validatedData = jobSeekerProfileSchema.parse(req.body);
      const updatedProfile = await this.jobSeekerService.updateProfile(
        userId,
        validatedData
      );
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const applications = await this.jobSeekerService.getApplications(userId);
      res.json(applications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}