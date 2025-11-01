import { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { format } from 'date-fns';
import { CheckCircle, Circle, Trash2, Edit2, Clock } from 'lucide-react';

const TaskList = ({ tasks, onTaskUpdate }) => {
  const { updateTask, deleteTask } = useTask();
  const [editingTask, setEditingTask] = useState(null);

  const handleStatusChange = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task._id, { status: newStatus });
    onTaskUpdate && onTaskUpdate();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      await deleteTask(taskId);
      onTaskUpdate && onTaskUpdate();
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-purple-100 text-purple-800',
      health: 'bg-green-100 text-green-800',
      learning: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      work: 'Công việc',
      personal: 'Cá nhân',
      health: 'Sức khỏe',
      learning: 'Học tập',
      other: 'Khác',
    };
    return labels[category] || category;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao',
    };
    return labels[priority] || priority;
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">Chưa có công việc nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách công việc</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${task.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}
              hover:shadow-md
            `}
          >
            <div className="flex items-start gap-3">
              {/* Status checkbox */}
              <button
                onClick={() => handleStatusChange(task)}
                className="mt-1 flex-shrink-0"
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Task content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`
                    font-semibold text-gray-800
                    ${task.status === 'completed' ? 'line-through text-gray-500' : ''}
                  `}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Category */}
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                    {getCategoryLabel(task.category)}
                  </span>

                  {/* Priority */}
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    Ưu tiên: {getPriorityLabel(task.priority)}
                  </span>

                  {/* Duration */}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.duration} phút
                  </span>

                  {/* Time */}
                  <span className="text-xs text-gray-500">
                    {format(new Date(task.startTime), 'HH:mm')} -{' '}
                    {format(new Date(task.endTime), 'HH:mm')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
