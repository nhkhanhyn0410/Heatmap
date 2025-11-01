import { useEffect, useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';

const Heatmap = ({ year, month, onDateClick }) => {
  const { heatmapData, fetchMonthlyHeatmap } = useTask();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchMonthlyHeatmap(year, month);
  }, [year, month, fetchMonthlyHeatmap]);

  const getIntensityColor = (intensity) => {
    const colors = {
      0: 'bg-gray-100',
      1: 'bg-green-200',
      2: 'bg-green-400',
      3: 'bg-green-600',
      4: 'bg-green-700',
      5: 'bg-green-800',
    };
    return colors[intensity] || 'bg-gray-100';
  };

  const handleDayClick = (dayData) => {
    setSelectedDate(dayData.date);
    onDateClick && onDateClick(dayData);
  };

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const firstDayOfMonth = getDay(startOfMonth(new Date(year, month - 1)));

  // Create array of days with empty slots for alignment
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = format(new Date(year, month - 1, day), 'yyyy-MM-dd');
    const dayData = heatmapData.find((d) => d.date === dateStr) || {
      date: dateStr,
      intensity: 0,
      totalHours: 0,
      completedTasks: 0,
      productivityScore: 0,
    };
    calendarDays.push(dayData);
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Bản đồ nhiệt tháng {month}/{year}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Nhấp vào ngày để xem chi tiết công việc
        </p>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const isSelected = dayData.date === selectedDate;
          const day = new Date(dayData.date).getDate();

          return (
            <button
              key={dayData.date}
              onClick={() => handleDayClick(dayData)}
              className={`
                aspect-square rounded-lg transition-all duration-200
                ${getIntensityColor(dayData.intensity)}
                ${isSelected ? 'ring-4 ring-primary-500 ring-offset-2' : ''}
                hover:ring-2 hover:ring-primary-300 hover:scale-105
                flex flex-col items-center justify-center
                relative group
              `}
            >
              <span className="text-sm font-semibold text-gray-800">{day}</span>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                  <div className="font-semibold">{format(new Date(dayData.date), 'dd/MM/yyyy')}</div>
                  <div>Giờ làm việc: {dayData.totalHours}h</div>
                  <div>Công việc: {dayData.completedTasks}</div>
                  <div>Năng suất: {dayData.productivityScore}%</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Cường độ hoạt động
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-2">Ít</span>
          {[0, 1, 2, 3, 4, 5].map((intensity) => (
            <div
              key={intensity}
              className={`w-6 h-6 rounded ${getIntensityColor(intensity)}`}
            ></div>
          ))}
          <span className="text-xs text-gray-500 ml-2">Nhiều</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
