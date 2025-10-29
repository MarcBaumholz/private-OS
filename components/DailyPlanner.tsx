import React from 'react';
import { PLANNER_TIMES } from '../constants';
import type { CalendarEvent } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string; className?: string }> = ({ children, title, className = '' }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 h-full flex flex-col ${className}`}>
        <h2 className="text-lg font-bold text-cyan-300 mb-4 px-2">{title}</h2>
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">{children}</div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
        `}</style>
    </div>
);

interface DailyPlannerProps {
    events: CalendarEvent[];
}

const colorClasses = {
    cyan: 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100',
    indigo: 'bg-indigo-500/30 border-l-4 border-indigo-400 text-indigo-100',
    teal: 'bg-teal-500/30 border-l-4 border-teal-400 text-teal-100',
    rose: 'bg-rose-500/30 border-l-4 border-rose-400 text-rose-100',
};


const DailyPlanner: React.FC<DailyPlannerProps> = ({ events }) => {
    const hourHeight = 60; // 60px per hour

    const getEventPosition = (event: CalendarEvent) => {
        const [hour, minute] = event.time.split(':').map(Number);
        const startTime = hour + minute / 60;
        const top = (startTime - 6) * hourHeight; // Start time is 6 AM
        const height = event.duration * hourHeight - 2; // -2 for a small gap
        return { top, height };
    };

    return (
        <Card title="Day's Agenda" className="h-full">
            <div className="relative">
                {/* Time slots and lines */}
                {PLANNER_TIMES.map((time, index) => (
                    <div key={time} className="h-[60px] flex items-start border-t border-slate-700/50">
                        <span className="text-xs font-mono text-slate-500 -mt-2.5 mr-2 bg-slate-800/50 px-1">{time}</span>
                    </div>
                ))}

                {/* Events */}
                <div className="absolute top-0 left-[50px] right-0 bottom-0">
                    {events.map(event => {
                        const { top, height } = getEventPosition(event);
                        return (
                            <div
                                key={event.id}
                                className={`absolute w-full p-2 rounded-md text-xs transition-all duration-300 ease-in-out ${colorClasses[event.color]}`}
                                style={{ top: `${top}px`, height: `${height}px` }}
                            >
                                <p className="font-bold">{event.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default DailyPlanner;
