import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Preferences routes
router.put('/preferences', updatePreferences);

// Password routes
const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];
router.put('/password', passwordValidation, validate, changePassword);

// Account deletion
router.delete('/account', deleteAccount);

export default router;
