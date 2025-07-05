import React from 'react';
import { TaskFilter as FilterType } from '../types/task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-1 rounded-full border transition text-sm font-medium ${
            currentFilter === filter.key
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-100'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            currentFilter === filter.key
              ? 'bg-white text-blue-500'
              : 'bg-blue-100 text-blue-500'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter; 