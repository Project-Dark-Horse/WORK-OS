import { prisma } from '../../shared/config/prisma';

class MessageService {
  async createMessage(data: {
    jobId: string;
    senderId: string;
    receiverId: string;
    messageContent: string;
  }) {
    try {
      return await prisma.messages.create({
        data: {
          job_id: data.jobId,
          sender_id: data.senderId,
          receiver_id: data.receiverId,
          message_content: data.messageContent,
          is_read: false,
        },
      });
    } catch (error) {
      console.error('Message creation failed:', error);
      throw error;
    }
  }

  async getMessagesByJobId(jobId: string) {
    try {
      return await prisma.messages.findMany({
        where: {
          job_id: jobId,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string) {
    try {
      return await prisma.messages.update({
        where: {
          message_id: messageId,
        },
        data: {
          is_read: true,
        },
      });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  }
}

export default new MessageService();