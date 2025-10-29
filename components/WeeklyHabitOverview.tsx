import React from 'react';
import type { Habit } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
        <h2 className="text-xl font-bold text-indigo-300 mb-4">{title}</h2>
        {children}
    </div>
);

interface WeeklyHabitOverviewProps {
    habits: Habit[];
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Mock consistency data for demo purposes
const mockConsistency = {
    1: [true, true, false, true, true, false, false],
    2: [true, false, true, false, true, true, false],
    3: [true, true, true, true, true, true, true],
    4: [false, true, true, false, true, true, false],
    5: [true, true, true, true, true, false, false],
    6: [true, true, true, true, false, true, true],
};


const WeeklyHabitOverview: React.FC<WeeklyHabitOverviewProps> = ({ habits }) => {
    return (
        <Card title="Weekly Habit Overview">
            <div className="space-y-4">
                {habits.map(habit => {
                    // Today's completion is real, the rest is mocked
                    const consistency = [...(mockConsistency[habit.id] || Array(6).fill(false)), habit.completed];

                    return (
                        <div key={habit.id} className="grid grid-cols-[1fr_2fr] items-center">
                            <div className="flex items-center text-sm">
                                {React.cloneElement(habit.icon as React.ReactElement, { className: "w-5 h-5 mr-2 text-slate-400"})}
                                <span className="text-slate-300">{habit.name}</span>
                            </div>
                            <div className="flex justify-end space-x-2">
                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs
                                        ${consistency[index] ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}
                                        `}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
};

export default WeeklyHabitOverview;
