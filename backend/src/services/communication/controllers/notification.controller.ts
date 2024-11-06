import { Request, Response } from 'express';
import notificationService from '../services/notification.service';

class NotificationController {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = req.user.id; 
      const notifications = await notificationService.getUserNotifications(userId);
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Notification controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      const notification = await notificationService.markNotificationAsRead(notificationId);
      return res.status(200).json(notification);
    } catch (error) {
      console.error('Notification controller error:', error);
      return res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }
}

export default new NotificationController();