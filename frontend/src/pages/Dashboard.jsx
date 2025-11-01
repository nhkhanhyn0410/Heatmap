import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User, Calendar } from 'lucide-react';

import Heatmap from '../components/Heatmap';
import TaskList from '../components/TaskList';
import AnalyticsPanel from '../components/AnalyticsPanel';
import AddTaskPanel from '../components/AddTaskPanel';
import ChatbotPanel from '../components/ChatbotPanel';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { fetchTasks, fetchTasksByDate } = useTask();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = await fetchTasksByDate(today);
    setTasks(todayTasks);
  };

  const handleDateClick = async (dayData) => {
    setSelectedDate(dayData.date);
    const dateTasks = await fetchTasksByDate(dayData.date);
    setTasks(dateTasks);
  };

  const handleTaskAdded = () => {
    if (selectedDate) {
      handleDateClick({ date: selectedDate });
    } else {
      loadTodayTasks();
    }
  };

  const handleTaskUpdate = () => {
    if (selectedDate) {
      handleDateClick({ date: selectedDate });
    } else {
      loadTodayTasks();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Productivity Tracker</h1>
                <p className="text-xs text-gray-500">Quản lý năng suất hiệu quả</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                <Plus className="w-5 h-5" />
                Thêm công việc
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Hồ sơ"
              >
                <User className="w-6 h-6" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Đăng xuất"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Xin chào, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Hãy theo dõi năng suất và quản lý công việc của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Left side (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md px-6 py-4">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition"
              >
                ← Tháng trước
              </button>
              <h3 className="text-lg font-bold text-gray-800">
                Tháng {currentMonth}/{currentYear}
              </h3>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition"
              >
                Tháng sau →
              </button>
            </div>

            {/* Heatmap */}
            <Heatmap year={currentYear} month={currentMonth} onDateClick={handleDateClick} />

            {/* Task List */}
            <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />

            {/* Analytics */}
            <AnalyticsPanel />
          </div>

          {/* Chatbot Panel - Right side (1/3) - Always visible */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ChatbotPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskPanel
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Dashboard;
