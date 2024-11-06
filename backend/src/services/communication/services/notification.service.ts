import { prisma } from '../../shared/config/prisma';
import emailService from './email.service';

class NotificationService {
  async createNotification(data: {
    userId: string;
    message: string;
    type: string;
  }) {
    try {
      const notification = await prisma.notifications.create({
        data: {
          user_id: data.userId,
          message: data.message,
          type: data.type,
          is_read: false,
        },
      });

      const user = await prisma.users.findUnique({
        where: {
          user_id: data.userId,
        },
      });

      if (user) {
        await emailService.sendEmail(
          user.email,
          `New ${data.type} Notification`,
          data.message
        );
      }

      return notification;
    } catch (error) {
      console.error('Notification creation failed:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string) {
    try {
      return await prisma.notifications.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      return await prisma.notifications.update({
        where: {
          notification_id: notificationId,
        },
        data: {
          is_read: true,
        },
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }
}

export default new NotificationService();