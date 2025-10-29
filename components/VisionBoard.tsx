import React, { useState } from 'react';
import type { Goal } from '../types';
import { generateVisionBoardImage } from '../services/geminiService';
import Modal from './Modal';
import Loader from './Loader';
import { PlusIcon } from './icons';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">{title}</h2>
        {children}
    </div>
);

interface VisionBoardProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ goals, setGoals }) => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add Goal Modal State
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalWhy, setNewGoalWhy] = useState('');
    const [newGoalImagePrompt, setNewGoalImagePrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalWhy || !newGoalImagePrompt) return;

        setIsGenerating(true);
        const imageUrl = await generateVisionBoardImage(newGoalImagePrompt);
        
        const newGoal: Goal = {
            id: Date.now(),
            title: newGoalTitle,
            why: newGoalWhy,
            imageUrl,
            imagePrompt: newGoalImagePrompt,
        };

        setGoals(prevGoals => [...prevGoals, newGoal]);
        setIsGenerating(false);
        setIsAddModalOpen(false);
        // Reset form
        setNewGoalTitle('');
        setNewGoalWhy('');
        setNewGoalImagePrompt('');
    };

    return (
        <>
            <Card title="Vision Board">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md aspect-[4/3]"
                            onClick={() => setSelectedGoal(goal)}
                        >
                            <img
                                src={goal.imageUrl}
                                alt={goal.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-sm font-bold">{goal.title}</h3>
                            </div>
                        </div>
                    ))}
                    <div
                        className="relative cursor-pointer group rounded-lg shadow-md bg-slate-800/60 hover:bg-slate-700/80 transition-colors flex items-center justify-center aspect-[4/3]"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <div className="text-center">
                            <PlusIcon className="w-10 h-10 mx-auto text-slate-400 group-hover:text-cyan-300 transition-colors" />
                            <p className="mt-2 text-sm font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">Add Goal</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* View Goal Modal */}
            <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)}>
                {selectedGoal && (
                    <div className="p-0">
                        <img src={selectedGoal.imageUrl} alt={selectedGoal.title} className="w-full h-64 object-cover rounded-t-lg" />
                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-cyan-300 mb-2">{selectedGoal.title}</h2>
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">My "Why"</h3>
                            <p className="text-slate-400">{selectedGoal.why}</p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Goal Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-4">Create a New Vision</h2>
                    <form onSubmit={handleAddGoal} className="space-y-4">
                        <div>
                            <label htmlFor="goal-title" className="block text-sm font-medium text-slate-300 mb-1">Goal Title</label>
                            <input type="text" id="goal-title" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} required className="w-full bg-slate-700/50 rounded-md border-slate-600 focus:border-cyan-400 focus:ring-cyan-400" />
                        </div>
                        <div>
                            <label htmlFor="goal-why" className="block text-sm font-medium text-slate-300 mb-1">My "Why"</label>
                            <textarea id="goal-why" value={newGoalWhy} onChange={e => setNewGoalWhy(e.target.value)} required rows={3} className="w-full bg-slate-700/50 rounded-md border-slate-600 focus:border-cyan-400 focus:ring-cyan-400 resize-none"></textarea>
                        </div>
                        <div>
                            <label htmlFor="goal-image-prompt" className="block text-sm font-medium text-slate-300 mb-1">Describe the image for your vision</label>
                            <input type="text" id="goal-image-prompt" value={newGoalImagePrompt} onChange={e => setNewGoalImagePrompt(e.target.value)} required placeholder='e.g., "A minimalist desk with morning light"' className="w-full bg-slate-700/50 rounded-md border-slate-600 focus:border-cyan-400 focus:ring-cyan-400" />
                        </div>
                        <button type="submit" disabled={isGenerating} className="w-full bg-cyan-500 text-slate-900 font-bold px-4 py-3 rounded-md hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
                            {isGenerating ? <Loader /> : 'Generate & Add Goal'}
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default VisionBoard;