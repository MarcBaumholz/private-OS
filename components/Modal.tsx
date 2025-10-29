
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl transform rounded-lg bg-slate-800 shadow-2xl transition-all duration-300 ease-in-out scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s forwards' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-slate-900 transition-transform hover:scale-110"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
      <style>{`
        @keyframes scale-in {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
