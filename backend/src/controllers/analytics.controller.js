import Task from '../models/Task.model.js';
import Activity from '../models/Activity.model.js';

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res, next) => {
  try {
    // Get last 7 days
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    // Get activities for the week
    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Calculate totals
    const totalTasks = activities.reduce((sum, a) => sum + a.completedTasks, 0);
    const totalHours = activities.reduce((sum, a) => sum + a.totalHours, 0);
    const avgProductivity = activities.length > 0
      ? activities.reduce((sum, a) => sum + a.productivityScore, 0) / activities.length
      : 0;

    // Find best day
    const bestDay = activities.reduce((best, current) => {
      return current.productivityScore > (best?.productivityScore || 0) ? current : best;
    }, null);

    // Find highest hours day
    const highestHoursDay = activities.reduce((best, current) => {
      return current.totalHours > (best?.totalHours || 0) ? current : best;
    }, null);

    // Calculate streak
    let currentStreak = 0;
    const sortedActivities = [...activities].reverse();
    for (const activity of sortedActivities) {
      if (activity.completedTasks > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Prepare daily data
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const activity = activities.find(
        a => a.date.toISOString().split('T')[0] === dateStr
      );

      dailyData.push({
        date: dateStr,
        completedTasks: activity?.completedTasks || 0,
        totalHours: activity?.totalHours || 0,
        productivityScore: activity?.productivityScore || 0
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalTasks,
          totalHours: Math.round(totalHours * 10) / 10,
          avgProductivity: Math.round(avgProductivity),
          currentStreak
        },
        insights: {
          bestDay: bestDay ? {
            date: bestDay.date.toISOString().split('T')[0],
            score: bestDay.productivityScore
          } : null,
          highestHoursDay: highestHoursDay ? {
            date: highestHoursDay.date.toISOString().split('T')[0],
            hours: highestHoursDay.totalHours
          } : null
        },
        dailyData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly analytics
// @route   GET /api/analytics/monthly/:year/:month
// @access  Private
export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate totals
    const totalTasks = activities.reduce((sum, a) => sum + a.totalTasks, 0);
    const completedTasks = activities.reduce((sum, a) => sum + a.completedTasks, 0);
    const totalHours = activities.reduce((sum, a) => sum + a.totalHours, 0);
    const avgProductivity = activities.length > 0
      ? activities.reduce((sum, a) => sum + a.productivityScore, 0) / activities.length
      : 0;

    // Category breakdown
    const categoryTotals = {
      work: 0,
      personal: 0,
      health: 0,
      learning: 0,
      other: 0
    };

    activities.forEach(activity => {
      Object.keys(categoryTotals).forEach(category => {
        categoryTotals[category] += activity.tasksByCategory[category] || 0;
      });
    });

    // Priority breakdown
    const priorityTotals = {
      low: 0,
      medium: 0,
      high: 0
    };

    activities.forEach(activity => {
      Object.keys(priorityTotals).forEach(priority => {
        priorityTotals[priority] += activity.tasksByPriority[priority] || 0;
      });
    });

    res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalTasks,
          completedTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          totalHours: Math.round(totalHours * 10) / 10,
          avgProductivity: Math.round(avgProductivity),
          activeDays: activities.filter(a => a.totalTasks > 0).length
        },
        breakdown: {
          byCategory: categoryTotals,
          byPriority: priorityTotals
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get productivity trends
// @route   GET /api/analytics/trends
// @access  Private
export const getProductivityTrends = async (req, res, next) => {
  try {
    const { period = 30 } = req.query; // Default 30 days

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    startDate.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const trends = activities.map(activity => ({
      date: activity.date.toISOString().split('T')[0],
      productivityScore: activity.productivityScore,
      totalHours: activity.totalHours,
      completedTasks: activity.completedTasks
    }));

    res.status(200).json({
      success: true,
      period: parseInt(period),
      trends
    });
  } catch (error) {
    next(error);
  }
};
