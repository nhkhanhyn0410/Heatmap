import express from 'express';
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getProductivityTrends
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly/:year/:month', getMonthlyAnalytics);
router.get('/trends', getProductivityTrends);

export default router;
