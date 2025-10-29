import React from 'react';
import type { Habit } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4">
        <h2 className="text-lg font-bold text-cyan-300 mb-3">{title}</h2>
        {children}
    </div>
);

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: number) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit }) => {
  return (
    <Card title="Daily Habits">
      <div className="flex items-center justify-around space-x-2">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => onToggleHabit(habit.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 w-20 h-20 group
              ${habit.completed
                ? 'bg-gradient-to-br from-cyan-400 to-teal-500 text-white'
                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
          >
            <div className={`transition-transform duration-300 text-slate-300 ${habit.completed ? 'scale-110 text-white' : 'group-hover:text-cyan-300'}`}>
                {React.cloneElement(habit.icon as React.ReactElement, { className: "w-7 h-7"})}
            </div>
            <span className={`mt-2 text-xs font-semibold ${habit.completed ? 'text-white' : 'text-slate-400'}`}>{habit.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default HabitTracker;
