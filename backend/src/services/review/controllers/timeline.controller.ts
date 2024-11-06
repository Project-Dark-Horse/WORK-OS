import { Request, Response } from 'express';
import timelineService from '../services/timeline.service';
import { validateTimeline } from '../validation/timeline.validation';

class TimelineController {
  async createTimelineEntry(req: Request, res: Response) {
    try {
      const { error } = validateTimeline(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { jobId, status, description } = req.body;
      const timeline = await timelineService.createTimelineEntry({
        jobId,
        status,
        description,
      });

      return res.status(201).json(timeline);
    } catch (error) {
      console.error('Timeline controller error:', error);
      return res.status(500).json({ error: 'Failed to create timeline entry' });
    }
  }

  async getJobTimeline(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const timeline = await timelineService.getJobTimeline(jobId);
      return res.status(200).json(timeline);
    } catch (error) {
      console.error('Timeline controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch timeline' });
    }
  }
}

export default new TimelineController();