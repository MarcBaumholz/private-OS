import React, { useState } from 'react';
import type { Todo, WeeklyGoal, CalendarEvent } from '../types';
import { suggestTasks } from '../services/geminiService';
import Loader from './Loader';
import { WandIcon } from './icons';


const Card: React.FC<{ children: React.ReactNode; title: string; className?: string; headerContent?: React.ReactNode }> = ({ children, title, className = '', headerContent }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 h-full flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-cyan-300">{title}</h2>
            {headerContent}
        </div>
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">{children}</div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
        `}</style>
    </div>
);

interface TodoListProps {
    todos: Todo[];
    onAddTodo: (text: string) => void;
    onToggleTodo: (id: number) => void;
    weeklyGoals: WeeklyGoal[];
    calendarEvents: CalendarEvent[];
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAddTodo, onToggleTodo, weeklyGoals, calendarEvents }) => {
    const [newTodo, setNewTodo] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim()) {
            onAddTodo(newTodo.trim());
            setNewTodo('');
        }
    };

    const handleSuggestTasks = async () => {
        setIsSuggesting(true);
        const suggestions = await suggestTasks({ weeklyGoals, calendarEvents });
        suggestions.forEach(task => onAddTodo(task));
        setIsSuggesting(false);
    };

    const SuggestButton = (
        <button
            onClick={handleSuggestTasks}
            disabled={isSuggesting}
            className="flex items-center gap-2 text-sm font-semibold bg-slate-700/50 text-cyan-300 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
            {isSuggesting ? (
                <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-cyan-300 rounded-full animate-spin"></div>
                    <span>Suggesting...</span>
                </>
            ) : (
                <>
                    <WandIcon className="w-4 h-4" />
                    <span>Suggest Tasks</span>
                </>
            )}
        </button>
    );

    return (
        <Card title="Tasks for Today" className="h-full" headerContent={SuggestButton}>
            <div className="flex-grow space-y-2 mb-4">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        onClick={() => onToggleTodo(todo.id)}
                        className="flex items-center cursor-pointer group p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                        <div className={`w-5 h-5 rounded-sm border-2 ${todo.completed ? 'bg-cyan-400 border-cyan-400' : 'border-slate-500'} flex items-center justify-center mr-3 transition-all flex-shrink-0`}>
                            {todo.completed && <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`flex-grow ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'} transition-colors`}>
                            {todo.text}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-auto flex gap-2 pt-4 border-t border-slate-700/50">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-slate-700/50 rounded-md border-slate-600 focus:border-cyan-400 focus:ring-cyan-400 focus:ring-opacity-50 text-sm"
                />
                <button type="submit" className="bg-cyan-500 text-slate-900 font-bold px-4 rounded-md hover:bg-cyan-400 transition-colors text-sm flex-shrink-0">
                    Add
                </button>
            </form>
        </Card>
    );
};

export default TodoList;