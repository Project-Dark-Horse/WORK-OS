// src/services/auth/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../supabase.client';

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the session using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: error?.message || 'Invalid token'
      });
    }

    // Add user to request object
    req.user = user;

    next();
  } catch (error: any) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: error.message 
    });
  }
};

// Optional: Role-based middleware
export const authorize = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user's role from your database
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !userProfile) {
        return res.status(401).json({ error: 'User profile not found' });
      }

      if (!allowedRoles.includes(userProfile.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (error: any) {
      console.error('Authorization Error:', error);
      return res.status(401).json({ 
        error: 'Authorization failed',
        message: error.message 
      });
    }
  };
};