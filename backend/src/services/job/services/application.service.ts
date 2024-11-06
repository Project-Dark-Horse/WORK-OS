import { prisma } from '../../shared/config/prisma';
import notificationService from '../../communication/services/notification.service';

class ApplicationService {
  async createApplication(data: {
    jobId: string;
    applicantId: string;
    bidAmount: number;
    coverLetter: string;
  }) {
    try {
      const job = await prisma.jobs.findUnique({
        where: {
          job_id: data.jobId,
        },
      });

      if (!job) {
        throw new Error('Job not found');
      }

      const application = await prisma.jobApplications.create({
        data: {
          job_id: data.jobId,
          applicant_id: data.applicantId,
          bid_amount: data.bidAmount,
          cover_letter: data.coverLetter,
          status: 'pending',
        },
      });

      await notificationService.createNotification({
        userId: job.poster_id,
        message: `New application received for job: ${job.task_topic}`,
        type: 'new_application',
      });

      return application;
    } catch (error) {
      console.error('Application creation failed:', error);
      throw error;
    }
  }

  async getApplicationsByJob(jobId: string) {
    try {
      return await prisma.jobApplications.findMany({
        where: {
          job_id: jobId,
        },
        include: {
          JobSeekerProfiles: true,
        },
      });
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
    try {
      const application = await prisma.jobApplications.update({
        where: {
          application_id: applicationId,
        },
        data: {
          status,
        },
        include: {
          Jobs: true,
        },
      });

      await notificationService.createNotification({
        userId: application.applicant_id,
        message: `Your application for ${application.Jobs.task_topic} has been ${status}`,
        type: 'application_update',
      });

      return application;
    } catch (error) {
      console.error('Failed to update application status:', error);
      throw error;
    }
  }
}

export default new ApplicationService();