import React from 'react';
import { TaskFilter as FilterType } from '../types/task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType | string) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
  priorityFilter?: 'all' | 'high' | 'medium' | 'low';
  onPriorityFilterChange?: (priority: 'all' | 'high' | 'medium' | 'low') => void;
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts, priorityFilter = 'all', onPriorityFilterChange }: TaskFilterProps) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2 items-center">
        <label htmlFor="priorityFilter" className="text-sm font-medium">Priority:</label>
        <select
          id="priorityFilter"
          value={priorityFilter}
          onChange={e => onPriorityFilterChange && onPriorityFilterChange(e.target.value as 'all' | 'high' | 'medium' | 'low')}
          className="px-2 py-1 border rounded text-sm"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
};

export default TaskFilter; 