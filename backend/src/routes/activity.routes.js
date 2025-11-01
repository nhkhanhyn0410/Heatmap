import express from 'express';
import {
  getActivities,
  getActivityByDate,
  getMonthlyHeatmap,
  updateActivityNotes
} from '../controllers/activity.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/', getActivities);
router.get('/heatmap/:year/:month', getMonthlyHeatmap);
router.get('/:date', getActivityByDate);
router.put('/:date/notes', updateActivityNotes);

export default router;
