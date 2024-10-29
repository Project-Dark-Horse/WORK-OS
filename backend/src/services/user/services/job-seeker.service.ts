import { supabase } from '../../supabase.client';
import { JobSeekerProfileDto } from '../validation/user.validation';
import { PrismaClient } from '@prisma/client';

export class JobSeekerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.jobSeeker.findUnique({
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

  async updateProfile(userId: string, data: JobSeekerProfileDto) {
    // Upload resume if provided
    let resumeUrl = data.resumeUrl;
    if (data.resumeUrl?.startsWith('data:')) {
      const { data: fileData, error } = await supabase.storage
        .from('resumes')
        .upload(`${userId}/resume`, data.resumeUrl, {
          upsert: true
        });

      if (error) throw error;
      resumeUrl = fileData.path;
    }

    const updatedProfile = await this.prisma.jobSeeker.update({
      where: { userId },
      data: {
        education: data.education,
        skills: data.skills,
        resumeUrl,
        portfolio: data.portfolio || []
      },
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

  async getApplications(userId: string) {
    return await this.prisma.application.findMany({
      where: {
        applicantId: userId
      },
      include: {
        job: {
          include: {
            poster: {
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