import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByDate
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Task validation
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('category').isIn(['work', 'personal', 'health', 'learning', 'other']).withMessage('Invalid category'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('startTime').isISO8601().withMessage('Invalid start time'),
  body('endTime').isISO8601().withMessage('Invalid end time')
];

// Routes
router.route('/')
  .get(getTasks)
  .post(taskValidation, validate, createTask);

router.get('/date/:date', getTasksByDate);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

export default router;
