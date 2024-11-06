import { Request, Response } from 'express';
import applicationService from '../services/application.service';
import { validateApplication } from '../validation/application.validation';

class ApplicationController {
  async createApplication(req: Request, res: Response) {
    try {
      const { error } = validateApplication(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { jobId, bidAmount, coverLetter } = req.body;
      const applicantId = req.user.id; // Assuming user is attached by auth middleware

      const application = await applicationService.createApplication({
        jobId,
        applicantId,
        bidAmount,
        coverLetter,
      });

      return res.status(201).json(application);
    } catch (error) {
      console.error('Application controller error:', error);
      return res.status(500).json({ error: 'Failed to create application' });
    }
  }

  async getJobApplications(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const applications = await applicationService.getApplicationsByJob(jobId);
      return res.status(200).json(applications);
    } catch (error) {
      console.error('Application controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const application = await applicationService.updateApplicationStatus(
        applicationId,
        status as 'accepted' | 'rejected'
      );
      return res.status(200).json(application);
    } catch (error) {
      console.error('Application controller error:', error);
      return res.status(500).json({ error: 'Failed to update application status' });
    }
  }
}

export default new ApplicationController();