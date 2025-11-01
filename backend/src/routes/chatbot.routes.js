import express from 'express';
import { body } from 'express-validator';
import {
  sendMessage,
  getSuggestions
} from '../controllers/chatbot.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Message validation
const messageValidation = [
  body('message').trim().notEmpty().withMessage('Message is required')
];

// Routes
router.post('/message', messageValidation, validate, sendMessage);
router.get('/suggestions', getSuggestions);

export default router;
