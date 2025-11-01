import { useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckSquare, Clock, Calendar } from 'lucide-react';

const AnalyticsPanel = () => {
  const { weeklyAnalytics, fetchWeeklyAnalytics } = useTask();

  useEffect(() => {
    fetchWeeklyAnalytics();
  }, [fetchWeeklyAnalytics]);

  if (!weeklyAnalytics) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const { summary, insights, dailyData } = weeklyAnalytics;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Phân tích năng suất 7 ngày</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Hiệu suất TB</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{summary.avgProductivity}%</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Công việc</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{summary.totalTasks}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Tổng giờ</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{summary.totalHours}h</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Chuỗi ngày</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{summary.currentStreak}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng năng suất</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).getDate() + '/' + (new Date(value).getMonth() + 1)}
              style={{ fontSize: '12px' }}
            />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              formatter={(value, name) => {
                const labels = {
                  productivityScore: 'Năng suất',
                  completedTasks: 'Công việc',
                  totalHours: 'Giờ làm việc'
                };
                return [value, labels[name] || name];
              }}
            />
            <Bar dataKey="productivityScore" fill="#0ea5e9" name="Năng suất" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Insights */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Thống kê tuần</h3>
        <div className="space-y-2">
          {insights.bestDay && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Ngày hiệu quả nhất:</span>
              <span className="font-semibold text-green-600">
                {new Date(insights.bestDay.date).getDate()}/{new Date(insights.bestDay.date).getMonth() + 1} ({insights.bestDay.score}%)
              </span>
            </div>
          )}
          {insights.highestHoursDay && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Giờ làm việc cao nhất:</span>
              <span className="font-semibold text-blue-600">
                {new Date(insights.highestHoursDay.date).getDate()}/{new Date(insights.highestHoursDay.date).getMonth() + 1} ({insights.highestHoursDay.hours}h)
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Mức độ duy trì:</span>
            <span className="font-semibold text-purple-600">
              {summary.currentStreak} ngày liên tiếp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
