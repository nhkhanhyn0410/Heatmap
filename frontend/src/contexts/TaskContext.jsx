import { createContext, useState, useContext, useCallback } from 'react';
import { taskAPI, activityAPI, analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.tasks);
      return response.data.tasks;
    } catch (error) {
      toast.error('Không thể tải danh sách công việc');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks by date
  const fetchTasksByDate = useCallback(async (date) => {
    try {
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      const response = await taskAPI.getTasksByDate(formattedDate);
      return response.data.tasks;
    } catch (error) {
      toast.error('Không thể tải công việc');
      return [];
    }
  }, []);

  // Create task
  const createTask = useCallback(async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks((prev) => [response.data.task, ...prev]);
      toast.success('Đã thêm công việc mới');
      return { success: true, task: response.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tạo công việc';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const response = await taskAPI.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data.task : task))
      );
      toast.success('Đã cập nhật công việc');
      return { success: true, task: response.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể cập nhật công việc';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success('Đã xóa công việc');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể xóa công việc';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Fetch monthly heatmap
  const fetchMonthlyHeatmap = useCallback(async (year, month) => {
    try {
      const response = await activityAPI.getMonthlyHeatmap(year, month);
      setHeatmapData(response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error('Không thể tải dữ liệu heatmap');
      return [];
    }
  }, []);

  // Fetch weekly analytics
  const fetchWeeklyAnalytics = useCallback(async () => {
    try {
      const response = await analyticsAPI.getWeeklyAnalytics();
      setWeeklyAnalytics(response.data.analytics);
      return response.data.analytics;
    } catch (error) {
      toast.error('Không thể tải phân tích tuần');
      return null;
    }
  }, []);

  const value = {
    tasks,
    activities,
    heatmapData,
    weeklyAnalytics,
    loading,
    fetchTasks,
    fetchTasksByDate,
    createTask,
    updateTask,
    deleteTask,
    fetchMonthlyHeatmap,
    fetchWeeklyAnalytics,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
