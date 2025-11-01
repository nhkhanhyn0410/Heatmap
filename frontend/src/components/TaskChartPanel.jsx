import { useEffect, useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Filter } from 'lucide-react';

const TaskChartPanel = () => {
  const { tasks, fetchTasks } = useTask();
  const [viewMode, setViewMode] = useState('priority'); // priority, category, difficulty, status
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch tasks for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    fetchTasks({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      processChartData();
    }
  }, [tasks, viewMode]);

  const processChartData = () => {
    // Group tasks by date
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    if (viewMode === 'priority') {
      const data = last7Days.map(date => {
        const dayTasks = tasks.filter(t => t.startTime.startsWith(date));
        return {
          date: formatDate(date),
          'Thấp': dayTasks.filter(t => t.priority === 'low').length,
          'Trung bình': dayTasks.filter(t => t.priority === 'medium').length,
          'Cao': dayTasks.filter(t => t.priority === 'high').length,
        };
      });
      setChartData(data);
    } else if (viewMode === 'category') {
      const data = last7Days.map(date => {
        const dayTasks = tasks.filter(t => t.startTime.startsWith(date));
        return {
          date: formatDate(date),
          'Công việc': dayTasks.filter(t => t.category === 'work').length,
          'Cá nhân': dayTasks.filter(t => t.category === 'personal').length,
          'Sức khỏe': dayTasks.filter(t => t.category === 'health').length,
          'Học tập': dayTasks.filter(t => t.category === 'learning').length,
          'Khác': dayTasks.filter(t => t.category === 'other').length,
        };
      });
      setChartData(data);
    } else if (viewMode === 'difficulty') {
      const data = last7Days.map(date => {
        const dayTasks = tasks.filter(t => t.startTime.startsWith(date));
        return {
          date: formatDate(date),
          'Mức 1': dayTasks.filter(t => t.difficulty === 1).length,
          'Mức 2': dayTasks.filter(t => t.difficulty === 2).length,
          'Mức 3': dayTasks.filter(t => t.difficulty === 3).length,
          'Mức 4': dayTasks.filter(t => t.difficulty === 4).length,
          'Mức 5': dayTasks.filter(t => t.difficulty === 5).length,
        };
      });
      setChartData(data);
    } else if (viewMode === 'status') {
      const data = last7Days.map(date => {
        const dayTasks = tasks.filter(t => t.startTime.startsWith(date));
        return {
          date: formatDate(date),
          'Hoàn thành': dayTasks.filter(t => t.status === 'completed').length,
          'Đang làm': dayTasks.filter(t => t.status === 'in-progress').length,
          'Chờ': dayTasks.filter(t => t.status === 'pending').length,
        };
      });
      setChartData(data);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  const getChartConfig = () => {
    const configs = {
      priority: {
        title: 'Phân bố công việc theo Ưu tiên',
        bars: [
          { dataKey: 'Thấp', fill: '#10b981', name: 'Thấp' },
          { dataKey: 'Trung bình', fill: '#f59e0b', name: 'Trung bình' },
          { dataKey: 'Cao', fill: '#ef4444', name: 'Cao' },
        ]
      },
      category: {
        title: 'Phân bố công việc theo Phân loại',
        bars: [
          { dataKey: 'Công việc', fill: '#3b82f6', name: 'Công việc' },
          { dataKey: 'Cá nhân', fill: '#a855f7', name: 'Cá nhân' },
          { dataKey: 'Sức khỏe', fill: '#10b981', name: 'Sức khỏe' },
          { dataKey: 'Học tập', fill: '#f59e0b', name: 'Học tập' },
          { dataKey: 'Khác', fill: '#6b7280', name: 'Khác' },
        ]
      },
      difficulty: {
        title: 'Phân bố công việc theo Độ khó',
        bars: [
          { dataKey: 'Mức 1', fill: '#86efac', name: 'Mức 1' },
          { dataKey: 'Mức 2', fill: '#4ade80', name: 'Mức 2' },
          { dataKey: 'Mức 3', fill: '#22c55e', name: 'Mức 3' },
          { dataKey: 'Mức 4', fill: '#16a34a', name: 'Mức 4' },
          { dataKey: 'Mức 5', fill: '#15803d', name: 'Mức 5' },
        ]
      },
      status: {
        title: 'Phân bố công việc theo Trạng thái',
        bars: [
          { dataKey: 'Hoàn thành', fill: '#10b981', name: 'Hoàn thành' },
          { dataKey: 'Đang làm', fill: '#3b82f6', name: 'Đang làm' },
          { dataKey: 'Chờ', fill: '#6b7280', name: 'Chờ' },
        ]
      }
    };

    return configs[viewMode];
  };

  const config = getChartConfig();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{config.title}</h2>
            <p className="text-sm text-gray-600">7 ngày gần đây</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="priority">Theo Ưu tiên</option>
            <option value="category">Theo Phân loại</option>
            <option value="difficulty">Theo Độ khó</option>
            <option value="status">Theo Trạng thái</option>
          </select>
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              style={{ fontSize: '12px' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
            />
            {config.bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có dữ liệu công việc trong 7 ngày qua</p>
            <p className="text-sm mt-1">Thêm công việc để xem biểu đồ</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {tasks.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Tổng công việc</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Đã hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Đang làm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Chưa bắt đầu</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskChartPanel;
