import React from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  searchTerm?: string;
}

const TaskList = ({ tasks, onToggle, onDelete, onEdit, searchTerm }: TaskListProps) => {
  if (tasks.length === 0) {
    return <div className="text-center text-gray-400 mt-8">No tasks to display.</div>;
  }
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
};

export default TaskList; 