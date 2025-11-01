import Activity from '../models/Activity.model.js';

// @desc    Get activities for date range
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity for specific date
// @route   GET /api/activities/:date
// @access  Private
export const getActivityByDate = async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const activity = await Activity.findOne({
      user: req.user.id,
      date
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'No activity found for this date'
      });
    }

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly heatmap data
// @route   GET /api/activities/heatmap/:year/:month
// @access  Private
export const getMonthlyHeatmap = async (req, res, next) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Create array of all days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const heatmapData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const activity = activities.find(
        a => a.date.getDate() === day
      );

      heatmapData.push({
        date: currentDate.toISOString().split('T')[0],
        intensity: activity ? activity.intensity : 0,
        totalHours: activity ? activity.totalHours : 0,
        completedTasks: activity ? activity.completedTasks : 0,
        productivityScore: activity ? activity.productivityScore : 0
      });
    }

    res.status(200).json({
      success: true,
      year: parseInt(year),
      month: parseInt(month),
      data: heatmapData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update activity notes
// @route   PUT /api/activities/:date/notes
// @access  Private
export const updateActivityNotes = async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const { notes } = req.body;

    const activity = await Activity.findOneAndUpdate(
      { user: req.user.id, date },
      { notes },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};
