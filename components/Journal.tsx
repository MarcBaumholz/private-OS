import React, { useState } from 'react';
import { getJournalPrompt } from '../services/geminiService';
import { ArrowPathIcon } from './icons';
import type { Habit } from '../types';

const Card: React.FC<{ children: React.ReactNode, title: string; headerContent?: React.ReactNode }> = ({ children, title, headerContent }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-300">{title}</h2>
            {headerContent}
        </div>
        <div className="flex-grow flex flex-col">{children}</div>
    </div>
);

interface JournalProps {
    journalEntry: string;
    onUpdateJournal: (text: string) => void;
    habits: Habit[];
}

const Journal: React.FC<JournalProps> = ({ journalEntry, onUpdateJournal, habits }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

    const handleGeneratePrompt = async () => {
        setIsLoadingPrompt(true);
        const newPrompt = await getJournalPrompt({ habits });
        setPrompt(newPrompt);
        setIsLoadingPrompt(false);
    };
    
    const PromptButton = (
        <button
            onClick={handleGeneratePrompt}
            disabled={isLoadingPrompt}
            className="text-slate-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
            title="Generate a new prompt"
        >
            <ArrowPathIcon className={`w-5 h-5 ${isLoadingPrompt ? 'animate-spin' : ''}`} />
        </button>
    );

    return (
        <Card title="Journal" headerContent={PromptButton}>
            {prompt && (
                <div className="mb-3 p-3 bg-slate-900/50 rounded-md">
                    <p className="text-sm italic text-cyan-200">{prompt}</p>
                </div>
            )}
            <textarea
                value={journalEntry}
                onChange={(e) => onUpdateJournal(e.target.value)}
                placeholder="What's on your mind today? Or, generate a prompt to get started!"
                className="w-full flex-grow bg-slate-700/30 rounded-md border-slate-600 focus:border-cyan-400 focus:ring-cyan-400 focus:ring-opacity-50 resize-none text-sm"
            />
        </Card>
    );
};

export default Journal;