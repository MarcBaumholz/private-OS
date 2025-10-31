import React, { useState } from 'react';
import type { Goal, LifeAreaCategory, Habit } from '../types';
import { generateVisionBoardImage } from '../services/geminiService';
import Modal from './Modal';
import Loader from './Loader';
import { PlusIcon } from './icons';
import GoalCard from './GoalCard';
import { LIFE_AREAS } from '../constants';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">{title}</h2>
        {children}
    </div>
);

interface VisionBoardProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
    habits?: Habit[]; // Optional, for showing related habits
}

const VisionBoard: React.FC<VisionBoardProps> = ({ goals, setGoals, habits = [] }) => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add Goal Modal State
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalWhy, setNewGoalWhy] = useState('');
    const [newGoalImagePrompt, setNewGoalImagePrompt] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState<LifeAreaCategory>('mind');
    const [newGoalProgress, setNewGoalProgress] = useState(0);
    const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
    const [newGoalTags, setNewGoalTags] = useState('');
    const [imageUploadMode, setImageUploadMode] = useState<'ai' | 'upload' | 'url'>('ai');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to base64 for display
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalWhy) return;

        let imageUrl = '';

        // Handle different image input modes
        if (imageUploadMode === 'ai') {
            if (!newGoalImagePrompt) return;
            setIsGenerating(true);
            imageUrl = await generateVisionBoardImage(newGoalImagePrompt);
            setIsGenerating(false);
        } else if (imageUploadMode === 'upload') {
            imageUrl = uploadedImageUrl || 'https://picsum.photos/seed/default/800/600';
        } else if (imageUploadMode === 'url') {
            imageUrl = uploadedImageUrl || 'https://picsum.photos/seed/default/800/600';
        }

        // Parse tags from comma-separated string
        const tagsArray = newGoalTags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const newGoal: Goal = {
            id: Date.now(),
            title: newGoalTitle,
            why: newGoalWhy,
            imageUrl,
            imagePrompt: imageUploadMode === 'ai' ? newGoalImagePrompt : undefined,
            category: newGoalCategory,
            progress: newGoalProgress,
            status: 'active',
            createdAt: new Date().toISOString(),
            targetDate: newGoalTargetDate || undefined,
            tags: tagsArray.length > 0 ? tagsArray : undefined,
            relatedHabits: [],
        };

        setGoals(prevGoals => [...prevGoals, newGoal]);
        setIsAddModalOpen(false);

        // Reset form
        setNewGoalTitle('');
        setNewGoalWhy('');
        setNewGoalImagePrompt('');
        setNewGoalCategory('mind');
        setNewGoalProgress(0);
        setNewGoalTargetDate('');
        setNewGoalTags('');
        setUploadedImageUrl('');
        setImageUploadMode('ai');
    };

    return (
        <>
            <Card title="Vision Board">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {goals.filter(g => g.status !== 'archived').map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onClick={() => setSelectedGoal(goal)}
                            habits={habits}
                        />
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

            {/* View/Edit Goal Modal - Enhanced */}
            <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)}>
                {selectedGoal && (
                    <div className="p-0 max-h-[80vh] overflow-y-auto">
                        {/* Goal Image */}
                        <div className="relative">
                            <img src={selectedGoal.imageUrl} alt={selectedGoal.title} className="w-full h-64 object-cover rounded-t-lg" />
                            {selectedGoal.status === 'completed' && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    ✓ Completed
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Title & Category */}
                            <div>
                                <h2 className="text-3xl font-bold text-cyan-300 mb-2">{selectedGoal.title}</h2>
                                {selectedGoal.category && (
                                    <span className="inline-block bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                                        {selectedGoal.category.charAt(0).toUpperCase() + selectedGoal.category.slice(1)}
                                    </span>
                                )}
                            </div>

                            {/* Why */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-2">My "Why"</h3>
                                <p className="text-slate-400">{selectedGoal.why}</p>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-slate-300">Progress</h3>
                                    <span className="text-cyan-300 font-bold">{selectedGoal.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full transition-all duration-500"
                                        style={{ width: `${selectedGoal.progress || 0}%` }}
                                    />
                                </div>
                                {/* Quick Progress Update Buttons */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            const newProgress = Math.min((selectedGoal.progress || 0) + 10, 100);
                                            setGoals(prev => prev.map(g =>
                                                g.id === selectedGoal.id
                                                    ? { ...g, progress: newProgress, status: newProgress === 100 ? 'completed' : g.status }
                                                    : g
                                            ));
                                            setSelectedGoal({ ...selectedGoal, progress: newProgress, status: newProgress === 100 ? 'completed' : selectedGoal.status });
                                        }}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        +10%
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newProgress = Math.max((selectedGoal.progress || 0) - 10, 0);
                                            setGoals(prev => prev.map(g =>
                                                g.id === selectedGoal.id
                                                    ? { ...g, progress: newProgress }
                                                    : g
                                            ));
                                            setSelectedGoal({ ...selectedGoal, progress: newProgress });
                                        }}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        -10%
                                    </button>
                                    {selectedGoal.status !== 'completed' && (
                                        <button
                                            onClick={() => {
                                                setGoals(prev => prev.map(g =>
                                                    g.id === selectedGoal.id
                                                        ? { ...g, progress: 100, status: 'completed' }
                                                        : g
                                                ));
                                                setSelectedGoal({ ...selectedGoal, progress: 100, status: 'completed' });
                                            }}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Related Habits */}
                            {selectedGoal.relatedHabits && selectedGoal.relatedHabits.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Related Habits</h3>
                                    <div className="space-y-2">
                                        {habits
                                            .filter(h => selectedGoal.relatedHabits?.includes(h.id))
                                            .map(habit => (
                                                <div key={habit.id} className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-md">
                                                    <span className="text-cyan-300">{habit.icon}</span>
                                                    <span className="text-slate-200">{habit.name}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {/* Target Date */}
                            {selectedGoal.targetDate && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-300 mb-1">Target Date</h3>
                                    <p className="text-slate-400">
                                        {new Date(selectedGoal.targetDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedGoal.tags && selectedGoal.tags.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGoal.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-slate-700">
                                {selectedGoal.status === 'completed' ? (
                                    <button
                                        onClick={() => {
                                            setGoals(prev => prev.map(g =>
                                                g.id === selectedGoal.id
                                                    ? { ...g, status: 'active' }
                                                    : g
                                            ));
                                            setSelectedGoal({ ...selectedGoal, status: 'active' });
                                        }}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md font-medium transition-colors"
                                    >
                                        Reactivate Goal
                                    </button>
                                ) : null}
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this goal?')) {
                                            setGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
                                            setSelectedGoal(null);
                                        }
                                    }}
                                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Delete Goal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Goal Modal - Enhanced */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-4">Create a New Vision</h2>
                    <form onSubmit={handleAddGoal} className="space-y-4">
                        {/* Goal Title */}
                        <div>
                            <label htmlFor="goal-title" className="block text-sm font-medium text-slate-300 mb-1">Goal Title *</label>
                            <input
                                type="text"
                                id="goal-title"
                                value={newGoalTitle}
                                onChange={e => setNewGoalTitle(e.target.value)}
                                required
                                placeholder="e.g., Run a Marathon"
                                className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                            />
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label htmlFor="goal-category" className="block text-sm font-medium text-slate-300 mb-1">Life Area *</label>
                            <select
                                id="goal-category"
                                value={newGoalCategory}
                                onChange={e => setNewGoalCategory(e.target.value as LifeAreaCategory)}
                                className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                            >
                                <option value="health">Health & Fitness</option>
                                <option value="career">Career & Work</option>
                                <option value="finance">Finance & Wealth</option>
                                <option value="mind">Mind & Intellect</option>
                                <option value="relationships">Relationships</option>
                                <option value="contribution">Contribution</option>
                            </select>
                        </div>

                        {/* My Why */}
                        <div>
                            <label htmlFor="goal-why" className="block text-sm font-medium text-slate-300 mb-1">My "Why" *</label>
                            <textarea
                                id="goal-why"
                                value={newGoalWhy}
                                onChange={e => setNewGoalWhy(e.target.value)}
                                required
                                rows={3}
                                placeholder="Why is this goal meaningful to you?"
                                className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none px-3 py-2 text-slate-200"
                            />
                        </div>

                        {/* Image Input Mode Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Goal Image</label>
                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setImageUploadMode('ai')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        imageUploadMode === 'ai'
                                            ? 'bg-cyan-500 text-slate-900'
                                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    AI Generate
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageUploadMode('upload')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        imageUploadMode === 'upload'
                                            ? 'bg-cyan-500 text-slate-900'
                                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageUploadMode('url')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        imageUploadMode === 'url'
                                            ? 'bg-cyan-500 text-slate-900'
                                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    URL
                                </button>
                            </div>

                            {/* AI Generation */}
                            {imageUploadMode === 'ai' && (
                                <input
                                    type="text"
                                    value={newGoalImagePrompt}
                                    onChange={e => setNewGoalImagePrompt(e.target.value)}
                                    required={imageUploadMode === 'ai'}
                                    placeholder='e.g., "Person crossing marathon finish line at sunrise"'
                                    className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                                />
                            )}

                            {/* File Upload */}
                            {imageUploadMode === 'upload' && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400"
                                />
                            )}

                            {/* URL Input */}
                            {imageUploadMode === 'url' && (
                                <input
                                    type="url"
                                    value={uploadedImageUrl}
                                    onChange={e => setUploadedImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                                />
                            )}
                        </div>

                        {/* Progress Slider */}
                        <div>
                            <label htmlFor="goal-progress" className="block text-sm font-medium text-slate-300 mb-1">
                                Current Progress: {newGoalProgress}%
                            </label>
                            <input
                                type="range"
                                id="goal-progress"
                                min="0"
                                max="100"
                                step="5"
                                value={newGoalProgress}
                                onChange={e => setNewGoalProgress(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Target Date */}
                        <div>
                            <label htmlFor="goal-target-date" className="block text-sm font-medium text-slate-300 mb-1">Target Date (Optional)</label>
                            <input
                                type="date"
                                id="goal-target-date"
                                value={newGoalTargetDate}
                                onChange={e => setNewGoalTargetDate(e.target.value)}
                                className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="goal-tags" className="block text-sm font-medium text-slate-300 mb-1">Tags (Optional)</label>
                            <input
                                type="text"
                                id="goal-tags"
                                value={newGoalTags}
                                onChange={e => setNewGoalTags(e.target.value)}
                                placeholder="fitness, health, running (comma-separated)"
                                className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full bg-cyan-500 text-slate-900 font-bold px-4 py-3 rounded-md hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isGenerating ? <Loader /> : 'Create Vision Goal'}
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default VisionBoard;