import { Express } from 'express';
import { AuthController } from '../services/auth/controllers/auth.controller';
import { JobSeekerController } from '../services/user/controllers/job-seeker.controller';
import { JobPosterController } from '../services/user/controllers/job-poster.controller';

export function configureRoutes(app: Express) {
  const authController = new AuthController();
  const jobSeekerController = new JobSeekerController();
  const jobPosterController = new JobPosterController();

  // Auth routes
  app.post('/auth/register', (req, res) => authController.register(req, res));
  app.post('/auth/login', (req, res) => authController.login(req, res));
  app.post('/auth/logout', (req, res) => authController.logout(req, res));
  app.post('/auth/reset-password', (req, res) => authController.resetPassword(req, res));

  // Job Seeker routes
  app.get('/api/job-seeker/profile', (req, res) => jobSeekerController.getProfile(req, res));
  app.put('/api/job-seeker/profile', (req, res) => jobSeekerController.updateProfile(req, res));
  app.get('/api/job-seeker/applications', (req, res) => jobSeekerController.getApplications(req, res));

  // Job Poster routes
  app.get('/api/job-poster/profile', (req, res) => jobPosterController.getProfile(req, res));
  app.put('/api/job-poster/profile', (req, res) => jobPosterController.updateProfile(req, res));
  app.get('/api/job-poster/jobs', (req, res) => jobPosterController.getPostedJobs(req, res));
}