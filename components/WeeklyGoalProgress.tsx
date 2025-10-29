import React from 'react';
import type { WeeklyGoal } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
        <h2 className="text-xl font-bold text-indigo-300 mb-4">{title}</h2>
        {children}
    </div>
);

interface WeeklyGoalProgressProps {
    goals: WeeklyGoal[];
    onToggleGoal: (id: number) => void;
}

const WeeklyGoalProgress: React.FC<WeeklyGoalProgressProps> = ({ goals, onToggleGoal }) => {
    const completedGoals = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;
    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return (
        <Card title="Weekly Goal Progress">
            <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                    <span className="font-semibold text-indigo-200">Overall Progress</span>
                    <span className="text-slate-400">{completedGoals} / {totalGoals} Completed</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="space-y-3">
                {goals.map(goal => (
                    <div
                        key={goal.id}
                        onClick={() => onToggleGoal(goal.id)}
                        className="flex items-center cursor-pointer group p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                        <div className={`w-5 h-5 rounded-sm border-2 ${goal.completed ? 'bg-indigo-400 border-indigo-400' : 'border-slate-500'} flex items-center justify-center mr-3 transition-all flex-shrink-0`}>
                            {goal.completed && <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`flex-grow ${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'} transition-colors`}>
                            {goal.text}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default WeeklyGoalProgress;
