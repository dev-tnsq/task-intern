import React from 'react';

export type TaskFilterType = 'all' | 'completed' | 'pending';

interface TaskFilterProps {
  filter: TaskFilterType;
  setFilter: (filter: TaskFilterType) => void;
  counts: { all: number; completed: number; pending: number };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, setFilter, counts }) => {
  const filters: { label: string; value: TaskFilterType }[] = [
    { label: `All (${counts.all})`, value: 'all' },
    { label: `Completed (${counts.completed})`, value: 'completed' },
    { label: `Pending (${counts.pending})`, value: 'pending' },
  ];
  return (
    <div className="flex gap-2 mb-4">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-4 py-1 rounded-full border transition text-sm font-medium ${filter === f.value ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-100'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter; 