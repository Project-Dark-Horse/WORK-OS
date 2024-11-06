import { prisma } from '../../shared/config/prisma';
import notificationService from '../../communication/services/notification.service';

class JobService {
  async createJob(data: {
    posterId: string;
    taskTopic: string;
    description: string;
    paymentAmount: number;
    expectedDeadline: Date;
    tags: string[];
  }) {
    try {
      return await prisma.jobs.create({
        data: {
          poster_id: data.posterId,
          task_topic: data.taskTopic,
          description: data.description,
          payment_amount: data.paymentAmount,
          expected_deadline: data.expectedDeadline,
          tags: data.tags,
          status: 'open',
        },
      });
    } catch (error) {
      console.error('Job creation failed:', error);
      throw error;
    }
  }

  async getJobs(filters: {
    status?: string;
    tags?: string[];
    minAmount?: number;
    maxAmount?: number;
  }) {
    try {
      return await prisma.jobs.findMany({
        where: {
          status: filters.status,
          payment_amount: {
            gte: filters.minAmount,
            lte: filters.maxAmount,
          },
          tags: {
            hasEvery: filters.tags,
          },
        },
        include: {
          JobPosterProfiles: true,
        },
      });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  }

  async assignJob(jobId: string, seekerId: string) {
    try {
      const updatedJob = await prisma.jobs.update({
        where: {
          job_id: jobId,
        },
        data: {
          status: 'assigned',
          assigned_to: seekerId,
        },
      });

      await prisma.jobTimeline.create({
        data: {
          job_id: jobId,
          status: 'assigned',
          description: 'Job assigned to seeker',
        },
      });

      await notificationService.createNotification({
        userId: seekerId,
        message: `You have been assigned to job: ${updatedJob.task_topic}`,
        type: 'job_assignment',
      });

      return updatedJob;
    } catch (error) {
      console.error('Failed to assign job:', error);
      throw error;
    }
  }

  async completeJob(jobId: string) {
    try {
      const updatedJob = await prisma.jobs.update({
        where: {
          job_id: jobId,
        },
        data: {
          status: 'completed',
        },
      });

      await prisma.jobTimeline.create({
        data: {
          job_id: jobId,
          status: 'completed',
          description: 'Job marked as completed',
        },
      });

      await notificationService.createNotification({
        userId: updatedJob.poster_id,
        message: `Job ${updatedJob.task_topic} has been marked as completed`,
        type: 'job_completion',
      });

      return updatedJob;
    } catch (error) {
      console.error('Failed to complete job:', error);
      throw error;
    }
  }
}

export default new JobService();