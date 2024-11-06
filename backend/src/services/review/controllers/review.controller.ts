import { Request, Response } from 'express';
import reviewService from '../services/review.service';
import { validateReview } from '../validation/review.validation';

class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const { error } = validateReview(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { reviewedId, jobId, rating, comment } = req.body;
      const reviewerId = req.user.id; 

      const review = await reviewService.createReview({
        reviewerId,
        reviewedId,
        jobId,
        rating,
        comment,
      });

      return res.status(201).json(review);
    } catch (error) {
      console.error('Review controller error:', error);
      return res.status(500).json({ error: 'Failed to create review' });
    }
  }

  async getUserReviews(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reviews = await reviewService.getUserReviews(userId);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Review controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }
}

export default new ReviewController();