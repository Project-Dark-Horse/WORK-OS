import { PrismaClient } from '@prisma/client';
import { JobPosterProfileDto } from '../validation/user.validation';

export class JobPosterService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.jobPoster.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, data: JobPosterProfileDto) {
    const updatedProfile = await this.prisma.jobPoster.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return updatedProfile;
  }

  async getPostedJobs(userId: string) {
    return await this.prisma.job.findMany({
      where: {
        posterId: userId
      },
      include: {
        applications: {
          include: {
            applicant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }
}