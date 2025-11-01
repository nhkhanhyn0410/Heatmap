import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  totalTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  completedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  totalHours: {
    type: Number,
    default: 0,
    min: 0
  },
  productivityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  intensity: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 // For heatmap color intensity
  },
  tasksByCategory: {
    work: { type: Number, default: 0 },
    personal: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    learning: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  tasksByPriority: {
    low: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    high: { type: Number, default: 0 }
  },
  averageFocusLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  averageDifficulty: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
activitySchema.index({ user: 1, date: -1 }, { unique: true });

// Calculate productivity score before saving
activitySchema.pre('save', function(next) {
  if (this.totalTasks > 0) {
    const completionRate = (this.completedTasks / this.totalTasks) * 100;
    const difficultyBonus = this.averageDifficulty * 5;
    const focusBonus = this.averageFocusLevel * 5;

    this.productivityScore = Math.min(
      Math.round((completionRate * 0.6) + (difficultyBonus * 0.2) + (focusBonus * 0.2)),
      100
    );
  } else {
    this.productivityScore = 0;
  }
  next();
});

// Calculate intensity for heatmap
activitySchema.pre('save', function(next) {
  // Intensity based on total hours and productivity score
  if (this.totalHours === 0) {
    this.intensity = 0;
  } else if (this.totalHours < 2) {
    this.intensity = 1;
  } else if (this.totalHours < 4) {
    this.intensity = 2;
  } else if (this.totalHours < 6) {
    this.intensity = 3;
  } else if (this.totalHours < 8) {
    this.intensity = 4;
  } else {
    this.intensity = 5;
  }

  // Adjust based on productivity score
  if (this.productivityScore < 30) {
    this.intensity = Math.max(1, this.intensity - 1);
  } else if (this.productivityScore > 80) {
    this.intensity = Math.min(5, this.intensity + 1);
  }

  next();
});

// Static method to update activity for a user and date
activitySchema.statics.updateDailyActivity = async function(userId, date) {
  const Task = mongoose.model('Task');

  // Normalize date to start of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all tasks for this date
  const tasks = await Task.find({
    user: userId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });

  if (tasks.length === 0) {
    return null;
  }

  // Calculate statistics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalHours = tasks.reduce((sum, t) => sum + (t.duration / 60), 0);

  const tasksByCategory = {
    work: tasks.filter(t => t.category === 'work').length,
    personal: tasks.filter(t => t.category === 'personal').length,
    health: tasks.filter(t => t.category === 'health').length,
    learning: tasks.filter(t => t.category === 'learning').length,
    other: tasks.filter(t => t.category === 'other').length
  };

  const tasksByPriority = {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length
  };

  const averageFocusLevel = tasks.reduce((sum, t) => sum + t.focusLevel, 0) / tasks.length;
  const averageDifficulty = tasks.reduce((sum, t) => sum + t.difficulty, 0) / tasks.length;

  // Update or create activity record
  const activity = await this.findOneAndUpdate(
    { user: userId, date: startOfDay },
    {
      totalTasks: tasks.length,
      completedTasks,
      totalHours: Math.round(totalHours * 10) / 10,
      tasksByCategory,
      tasksByPriority,
      averageFocusLevel: Math.round(averageFocusLevel * 10) / 10,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10
    },
    { upsert: true, new: true }
  );

  return activity;
};

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
