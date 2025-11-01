import axios from 'axios';
import Activity from '../models/Activity.model.js';
import Task from '../models/Task.model.js';

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { message, includeContext } = req.body;

    // Build system message with context
    let systemMessage = `Bạn là một trợ lý AI chuyên về năng suất và quản lý thời gian.
Bạn giúp người dùng phân tích hiệu suất làm việc, đưa ra lời khuyên về quản lý thời gian,
và cung cấp các gợi ý để cải thiện năng suất. Hãy trả lời bằng tiếng Việt một cách thân thiện và hữu ích.`;

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

      if (activities.length > 0) {
        const totalTasks = activities.reduce((sum, a) => sum + a.completedTasks, 0);
        const totalHours = activities.reduce((sum, a) => sum + a.totalHours, 0);
        const avgProductivity = activities.reduce((sum, a) => sum + a.productivityScore, 0) / activities.length;

        const contextInfo = `

Dữ liệu năng suất 7 ngày gần đây của người dùng:
- Tổng công việc hoàn thành: ${totalTasks}
- Tổng giờ làm việc: ${Math.round(totalHours * 10) / 10}h
- Điểm năng suất trung bình: ${Math.round(avgProductivity)}%

Chi tiết từng ngày:
${activities.map(a => `- ${a.date.toISOString().split('T')[0]}: ${a.completedTasks} công việc, ${a.totalHours}h, điểm ${a.productivityScore}%`).join('\n')}

Hãy sử dụng dữ liệu này để đưa ra phân tích và lời khuyên cụ thể.`;

        systemMessage += contextInfo;
      }
    }

    // Call DeepSeek API
    const deepseekResponse = await axios.post(
      `${process.env.DEEPSEEK_API_URL}/chat/completions`,
      {
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = deepseekResponse.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        suggestions: [] // Will be populated by getSuggestions endpoint
      }
    });
  } catch (error) {
    console.error('DeepSeek API error:', error.response?.data || error.message);

    // Fallback response if API fails
    res.status(200).json({
      success: true,
      data: {
        response: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng kiểm tra cấu hình DEEPSEEK_API_KEY trong file .env hoặc thử lại sau.',
        suggestions: [
          'Cách cải thiện năng suất làm việc?',
          'Mẹo quản lý thời gian hiệu quả?',
          'Phân tích hiệu suất tuần này'
        ]
      }
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
