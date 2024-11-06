import { Request, Response } from 'express';
import jobService from '../services/job.service';
import { validateJob } from '../validation/job.validation';

class JobController {
  async createJob(req: Request, res: Response) {
    try {
      const { error } = validateJob(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { taskTopic, description, paymentAmount, expectedDeadline, tags } = req.body;
      const posterId = req.user.id;

      const job = await jobService.createJob({
        posterId,
        taskTopic,
        description,
        paymentAmount,
        expectedDeadline: new Date(expectedDeadline),
        tags,
      });

      return res.status(201).json(job);
    } catch (error) {
      console.error('Job controller error:', error);
      return res.status(500).json({ error: 'Failed to create job' });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      const { status, tags, minAmount, maxAmount } = req.query;
      const jobs = await jobService.getJobs({
        status: status as string,
        tags: tags ? (tags as string).split(',') : undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      });
      return res.status(200).json(jobs);
    } catch (error) {
      console.error('Job controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  async assignJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const { seekerId } = req.body;
      const job = await jobService.assignJob(jobId, seekerId);
      return res.status(200).json(job);
    } catch (error) {
      console.error('Job controller error:', error);
      return res.status(500).json({ error: 'Failed to assign job' });
    }
  }

  async completeJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const job = await jobService.completeJob(jobId);
      return res.status(200).json(job);
    } catch (error) {
      console.error('Job controller error:', error);
      return res.status(500).json({ error: 'Failed to complete job' });
    }
  }
}

export default new JobController();