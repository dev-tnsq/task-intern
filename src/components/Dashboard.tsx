import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskFilter, DeletedTask } from '../types/task';
import TaskForm from './TaskForm';
import TaskFilterComponent from './TaskFilter';
import Snackbar from './Snackbar';
import TaskList from './TaskList';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskTracker_tasks', []);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletedTask, setDeletedTask] = useState<DeletedTask | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter((task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    switch (filter) {
      case 'completed':
        return filtered.filter((task: Task) => task.completed);
      case 'pending':
        return filtered.filter((task: Task) => !task.completed);
      default:
        return filtered;
    }
  }, [tasks, filter, searchTerm]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    completed: tasks.filter((task: Task) => task.completed).length,
    pending: tasks.filter((task: Task) => !task.completed).length,
  }), [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev: Task[]) => [newTask, ...prev]);
    setShowAddForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    setTasks((prev: Task[]) => prev.map((task: Task) =>
      task.id === editingTask.id ? { ...task, ...taskData } : task
    ));
    setEditingTask(null);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev: Task[]) => prev.map((task: Task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((task: Task) => task.id === id);
    if (taskToDelete) {
      setDeletedTask({ task: taskToDelete, timestamp: Date.now() });
      setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id));
    }
  };

  const handleUndoDelete = () => {
    if (deletedTask) {
      setTasks((prev: Task[]) => [deletedTask.task, ...prev]);
      setDeletedTask(null);
    }
  };

  const handleDismissSnackbar = () => {
    setDeletedTask(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        setShowAddForm(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowAddForm(false);
        setEditingTask(null);
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-blue-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Task Tracker</h1>
          <p className="text-blue-100 dark:text-gray-300">Welcome back, {username}!</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="bg-white dark:bg-gray-700 text-blue-600 dark:text-yellow-300 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition"
            title="Toggle dark mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button onClick={onLogout} className="bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition">Logout</button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {!showAddForm && !editingTask && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
            >
              + Add New Task
              <span className="text-xs opacity-75 ml-1">(Ctrl+N)</span>
            </button>
          )}
          <div className="relative flex-1">
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search tasks... (Ctrl+/)"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {(showAddForm || editingTask) && (
          <TaskForm
            onSubmit={editingTask
              ? (data) => {
                  if (editingTask) {
                    handleEditTask({ ...editingTask, ...data });
                  }
                }
              : handleAddTask}
            editingTask={editingTask || undefined}
            onCancel={() => {
              setShowAddForm(false);
              setEditingTask(null);
            }}
          />
        )}
        {!(showAddForm || editingTask) && (
          <>
            <TaskFilterComponent
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onEdit={setEditingTask}
              searchTerm={searchTerm}
            />
          </>
        )}
      </main>
      <Snackbar
        deletedTask={deletedTask}
        onUndo={handleUndoDelete}
        onDismiss={handleDismissSnackbar}
      />
    </div>
  );
};

export default Dashboard; 