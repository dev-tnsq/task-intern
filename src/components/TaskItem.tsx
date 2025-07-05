import { useState } from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  searchTerm?: string;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit, searchTerm }: TaskItemProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(task.id);
      setIsAnimating(false);
    }, 150);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    } else {
      return { text: `Due in ${diffDays} days`, isOverdue: false };
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-all duration-300 mb-2 ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-400 dark:border-red-500' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isAnimating ? 'ring-2 ring-blue-400' : ''
          } ${
            task.completed
              ? 'bg-green-400 border-green-400 text-white'
              : 'border-gray-400 hover:border-blue-500 hover:scale-110'
          }`}
        >
          {task.completed && <span className="block w-3 h-3 bg-white rounded-full" />}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>{searchTerm ? highlightText(task.title, searchTerm) : task.title}</h4>
          {/* Priority label */}
          {task.priority && (
            <span className={`inline-block text-xs font-semibold rounded px-2 py-0.5 mt-1 mr-2
              ${task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : ''}
              ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' : ''}
              ${task.priority === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : ''}
            `}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
          )}
          {task.description && (
            <p className={`text-sm text-gray-500 dark:text-gray-300 mt-1 ${task.completed ? 'line-through' : ''}`}>{searchTerm ? highlightText(task.description, searchTerm) : task.description}</p>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full text-xs">#{tag}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-300">
            <span>Created {formatDate(task.createdAt)}</span>
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${
                formatDueDate(task.dueDate).isOverdue
                  ? 'text-red-500 font-medium'
                  : formatDueDate(task.dueDate).isToday
                  ? 'text-yellow-600 font-medium'
                  : ''
              }`}>
                <span>📅</span>
                <span>{formatDueDate(task.dueDate).text}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors duration-200 hover:scale-105"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded-md transition-all duration-200 hover:scale-105"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      {/* Modal for delete confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Delete Task</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
