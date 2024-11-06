import { prisma } from '../../shared/config/prisma';

class TimelineService {
  async createTimelineEntry(data: {
    jobId: string;
    status: 'assigned' | 'assets_shared' | 'completed';
    description: string;
  }) {
    try {
      return await prisma.jobTimeline.create({
        data: {
          job_id: data.jobId,
          status: data.status,
          description: data.description,
        },
      });
    } catch (error) {
      console.error('Timeline entry creation failed:', error);
      throw error;
    }
  }

  async getJobTimeline(jobId: string) {
    try {
      return await prisma.jobTimeline.findMany({
        where: {
          job_id: jobId,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
      throw error;
    }
  }
}

export default new TimelineService();