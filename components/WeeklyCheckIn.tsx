import React, { useState } from 'react';
import { generateWeeklySummary } from '../services/geminiService';
import Loader from './Loader';
import type { Habit, Todo } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
        <h2 className="text-xl font-bold text-indigo-300 mb-4">{title}</h2>
        {children}
    </div>
);

const parseMarkdown = (text: string) => {
  const html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-indigo-200 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-indigo-300 mt-6 mb-3">$1</h2>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>')
    .replace(/\n/g, '<br />');

  return { __html: html };
};

interface WeeklyCheckInProps {
    data: {
        habits: Habit[];
        todos: Todo[];
        journalEntry: string;
    }
}

const WeeklyCheckIn: React.FC<WeeklyCheckInProps> = ({ data }) => {
    const [summary, setSummary] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleGenerate = async () => {
        setLoading(true);
        const result = await generateWeeklySummary(data);
        setSummary(result);
        setLoading(false);
    };

    return (
        <Card title="Weekly Check-In">
            {loading ? (
                <div>
                    <p className="text-center text-slate-400 mb-2">Analyzing your progress...</p>
                    <Loader />
                </div>
            ) : summary ? (
                 <div className="prose prose-invert prose-sm text-slate-300" dangerouslySetInnerHTML={parseMarkdown(summary)} />
            ) : (
                <div className="text-center flex flex-col justify-center items-center h-full">
                    <p className="text-slate-400 mb-4">Ready for a motivational boost? Let's review your week's achievements.</p>
                    <button
                        onClick={handleGenerate}
                        className="bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-400 transition-all transform hover:scale-105"
                    >
                        Generate My Weekly Summary
                    </button>
                </div>
            )}
        </Card>
    );
};

export default WeeklyCheckIn;
