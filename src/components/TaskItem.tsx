import React from 'react';
import { Task } from './TaskManager';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <li className={`flex items-start gap-3 p-4 rounded shadow bg-white border-l-4 ${task.completed ? 'border-green-500 opacity-60' : 'border-blue-400'}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="mt-1 accent-green-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
        </div>
        {task.description && <div className="text-gray-600 text-sm mt-1">{task.description}</div>}
        <div className="text-xs text-gray-400 mt-2">Created: {new Date(task.createdAt).toLocaleString()}</div>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-500 hover:underline text-xs"
        >Edit</button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:underline text-xs"
        >Delete</button>
      </div>
    </li>
  );
};

export default TaskItem; 