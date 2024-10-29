// // src/index.ts
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import { AuthController } from './services/auth/controllers/auth.controller';
// import { JobSeekerController } from './services/user/controllers/job-seeker.controller';
// import { JobPosterController } from './services/user/controllers/job-poster.controller';
// import { authMiddleware } from './services/auth/middleware/auth.middleware';

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Controllers
// const authController = new AuthController();
// const jobSeekerController = new JobSeekerController();
// const jobPosterController = new JobPosterController();

// // Test routes
// app.get('/', (req: Request, res: Response) => {
//   res.json({
//     message: "API is running"
//   });
// });

// // Auth routes
// app.post('/auth/register', (req, res) => authController.register(req, res));
// app.post('/auth/login', (req, res) => authController.login(req, res));
// app.post('/auth/logout', (req, res) => authController.logout(req, res));
// app.post('/auth/reset-password', (req, res) => authController.resetPassword(req, res));

// // Protected Job Seeker routes
// app.get('/api/job-seeker/profile', authMiddleware, (req, res) => 
//   jobSeekerController.getProfile(req, res)
// );
// app.put('/api/job-seeker/profile', authMiddleware, (req, res) => 
//   jobSeekerController.updateProfile(req, res)
// );
// app.get('/api/job-seeker/applications', authMiddleware, (req, res) => 
//   jobSeekerController.getApplications(req, res)
// );

// // Protected Job Poster routes
// app.get('/api/job-poster/profile', authMiddleware, (req, res) => 
//   jobPosterController.getProfile(req, res)
// );
// app.put('/api/job-poster/profile', authMiddleware, (req, res) => 
//   jobPosterController.updateProfile(req, res)
// );
// app.get('/api/job-poster/jobs', authMiddleware, (req, res) => 
//   jobPosterController.getPostedJobs(req, res)
// );

// // Error handling middleware
// app.use((err: Error, req: Request, res: Response, _next: any) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: 'Internal Server Error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `Route ${req.method} ${req.url} not found`
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   console.log('Environment:', process.env.NODE_ENV || 'development');
// });

// process.on('unhandledRejection', (error: Error) => {
//   console.error('Unhandled Promise Rejection:', error);
// });


// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { configureRoutes } from './routes';
import { config } from './config';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: "API is running"
  });
});

// Configure routes
configureRoutes(app);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
  console.log('Environment:', config.nodeEnv);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error);
});