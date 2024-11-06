import { Request, Response } from 'express';
import messageService from '../services/message.service';

class MessageController {
  async createMessage(req: Request, res: Response) {
    try {
      const { jobId, receiverId, messageContent } = req.body;
      const senderId = req.user.id;

      const message = await messageService.createMessage({
        jobId,
        senderId,
        receiverId,
        messageContent,
      });

      return res.status(201).json(message);
    } catch (error) {
      console.error('Message controller error:', error);
      return res.status(500).json({ error: 'Failed to create message' });
    }
  }

  async getMessagesByJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const messages = await messageService.getMessagesByJobId(jobId);
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Message controller error:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const message = await messageService.markMessageAsRead(messageId);
      return res.status(200).json(message);
    } catch (error) {
      console.error('Message controller error:', error);
      return res.status(500).json({ error: 'Failed to mark message as read' });
    }
  }
}

export default new MessageController();