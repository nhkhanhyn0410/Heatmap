import axios from 'axios';
import Activity from '../models/Activity.model.js';
import Task from '../models/Task.model.js';

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { message, includeContext } = req.body;

    let context = {};

    // If user wants to include their productivity context
    if (includeContext) {
      // Get last 7 days activities
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const activities = await Activity.find({
        user: req.user.id,
        date: { $gte: startDate, $lte: endDate }
      });

      const totalTasks = activities.reduce((sum, a) => sum + a.completedTasks, 0);
      const totalHours = activities.reduce((sum, a) => sum + a.totalHours, 0);
      const avgProductivity = activities.length > 0
        ? activities.reduce((sum, a) => sum + a.productivityScore, 0) / activities.length
        : 0;

      context = {
        weeklyStats: {
          totalTasks,
          totalHours: Math.round(totalHours * 10) / 10,
          avgProductivity: Math.round(avgProductivity)
        },
        recentActivities: activities.map(a => ({
          date: a.date.toISOString().split('T')[0],
          tasks: a.completedTasks,
          hours: a.totalHours,
          score: a.productivityScore
        }))
      };
    }

    // Prepare request to chatbot API
    const chatbotRequest = {
      message,
      context,
      userId: req.user.id
    };

    // TODO: Replace with actual chatbot API endpoint
    // For now, return a mock response
    const mockResponse = {
      response: "This is a mock chatbot response. To enable real chatbot functionality, configure the CHATBOT_API_URL and CHATBOT_API_KEY in your .env file.",
      suggestions: [
        "How can I improve my productivity?",
        "What's my best performing day this week?",
        "Give me tips for time management"
      ]
    };

    // Uncomment when chatbot API is configured
    /*
    const chatbotResponse = await axios.post(
      process.env.CHATBOT_API_URL,
      chatbotRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CHATBOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    */

    res.status(200).json({
      success: true,
      data: mockResponse // Replace with chatbotResponse.data when API is configured
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error communicating with chatbot service'
    });
  }
};

// @desc    Get chatbot suggestions
// @route   GET /api/chatbot/suggestions
// @access  Private
export const getSuggestions = async (req, res, next) => {
  try {
    // Get user's recent productivity data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    const avgProductivity = activities.length > 0
      ? activities.reduce((sum, a) => sum + a.productivityScore, 0) / activities.length
      : 0;

    // Generate contextual suggestions
    const suggestions = [];

    if (avgProductivity < 50) {
      suggestions.push("How can I boost my productivity?");
      suggestions.push("What are effective time management techniques?");
    } else if (avgProductivity > 80) {
      suggestions.push("How can I maintain my high productivity?");
      suggestions.push("Tips for avoiding burnout");
    }

    suggestions.push(
      "Analyze my weekly performance",
      "What tasks should I prioritize today?",
      "Help me set realistic goals",
      "How to improve work-life balance?"
    );

    res.status(200).json({
      success: true,
      suggestions: suggestions.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};
