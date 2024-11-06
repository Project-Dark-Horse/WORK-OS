import { prisma } from '../../shared/config/prisma';
import notificationService from '../../communication/services/notification.service';

class ReviewService {
  async createReview(data: {
    reviewerId: string;
    reviewedId: string;
    jobId: string;
    rating: number;
    comment: string;
  }) {
    try {
      const review = await prisma.reviews.create({
        data: {
          reviewer_id: data.reviewerId,
          reviewed_id: data.reviewedId,
          job_id: data.jobId,
          rating: data.rating,
          comment: data.comment,
        },
      });

      const userReviews = await prisma.reviews.findMany({
        where: {
          reviewed_id: data.reviewedId,
        },
      });

      const avgRating = userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length;

      const user = await prisma.users.findUnique({
        where: {
          user_id: data.reviewedId,
        },
      });

      if (user.role === 'job_seeker') {
        await prisma.jobSeekerProfiles.update({
          where: {
            user_id: data.reviewedId,
          },
          data: {
            rating: avgRating,
          },
        });
      } else {
        await prisma.jobPosterProfiles.update({
          where: {
            user_id: data.reviewedId,
          },
          data: {
            rating: avgRating,
          },
        });
      }

      await notificationService.createNotification({
        userId: data.reviewedId,
        message: `You have received a new review with rating ${data.rating}`,
        type: 'new_review',
      });

      return review;
    } catch (error) {
      console.error('Review creation failed:', error);
      throw error;
    }
  }

  async getUserReviews(userId: string) {
    try {
      return await prisma.reviews.findMany({
        where: {
          reviewed_id: userId,
        },
        include: {
          ReviewerUser: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      throw error;
    }
  }
}

export default new ReviewService();