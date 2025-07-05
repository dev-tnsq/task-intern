import { useState, useEffect } from 'react';
import { DeletedTask } from '../types/task';

interface SnackbarProps {
  deletedTask: DeletedTask | null;
  onUndo: () => void;
  onDismiss: () => void;
}

const Snackbar = ({ deletedTask, onUndo, onDismiss }: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (deletedTask) {
      setIsVisible(true);
      setIsExiting(false);
      const timer = setTimeout(() => {
        handleExit();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [deletedTask]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  const handleUndo = () => {
    onUndo();
    handleExit();
  };

  if (!isVisible || !deletedTask) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4 transition-all ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <span className="text-sm">
        <strong>{deletedTask.task.title}</strong> deleted
      </span>
      <button
        onClick={handleUndo}
        className="text-blue-300 hover:text-blue-100 font-medium text-sm transition-colors"
      >
        Undo
      </button>
      <button
        onClick={handleExit}
        className="text-gray-400 hover:text-white text-lg leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
};

export default Snackbar; 