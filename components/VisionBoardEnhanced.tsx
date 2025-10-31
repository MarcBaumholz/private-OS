import React, { useState, useRef } from 'react';
import type { Goal, LifeAreaCategory, Habit } from '../types';
import { generateVisionBoardImage } from '../services/geminiService';
import Modal from './Modal';
import Loader from './Loader';
import { PlusIcon } from './icons';
import GoalCard from './GoalCard';
import VisionBoardStats from './VisionBoardStats';
import Confetti from './Confetti';
import { VISION_BOARD_TEMPLATES } from './VisionBoardTemplates';
import { exportGoalsData, importGoalsData } from '../hooks/useLocalStorage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Goal Card Wrapper
interface SortableGoalCardProps {
  goal: Goal;
  onClick: () => void;
  habits: Habit[];
}

const SortableGoalCard: React.FC<SortableGoalCardProps> = ({ goal, onClick, habits }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GoalCard goal={goal} onClick={onClick} habits={habits} />
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode; title?: string; actions?: React.ReactNode }> = ({ children, title, actions }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-300">{title}</h2>
        {actions}
      </div>
    )}
    {children}
  </div>
);

type LayoutMode = 'grid' | 'category';
type FilterMode = 'all' | 'active' | 'completed';

interface VisionBoardEnhancedProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  habits?: Habit[];
}

const VisionBoardEnhanced: React.FC<VisionBoardEnhancedProps> = ({ goals, setGoals, habits = [] }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // UI State
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LifeAreaCategory | 'all'>('all');

  // Add Goal Modal State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalWhy, setNewGoalWhy] = useState('');
  const [newGoalImagePrompt, setNewGoalImagePrompt] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<LifeAreaCategory>('mind');
  const [newGoalProgress, setNewGoalProgress] = useState(0);
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
  const [newGoalTags, setNewGoalTags] = useState('');
  const [newGoalRelatedHabits, setNewGoalRelatedHabits] = useState<number[]>([]);
  const [imageUploadMode, setImageUploadMode] = useState<'ai' | 'upload' | 'url'>('ai');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      relatedHabits: newGoalRelatedHabits,
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
    setNewGoalRelatedHabits([]);
    setUploadedImageUrl('');
    setImageUploadMode('ai');
  };

  const handleApplyTemplate = async (templateId: string) => {
    const template = VISION_BOARD_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setIsGenerating(true);
    const newGoals: Goal[] = [];

    for (const goalTemplate of template.goals) {
      const imageUrl = await generateVisionBoardImage(goalTemplate.imagePrompt || 'inspiring vision');
      newGoals.push({
        ...goalTemplate,
        id: Date.now() + Math.random(),
        imageUrl,
        createdAt: new Date().toISOString(),
      });
    }

    setGoals(prev => [...prev, ...newGoals]);
    setIsGenerating(false);
    setIsTemplateModalOpen(false);
  };

  const handleUpdateProgress = (goalId: number, newProgress: number) => {
    const wasCompleted = goals.find(g => g.id === goalId)?.status === 'completed';
    const isNowCompleted = newProgress === 100;

    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? { ...g, progress: newProgress, status: isNowCompleted ? 'completed' : g.status }
        : g
    ));

    if (selectedGoal?.id === goalId) {
      setSelectedGoal({ ...selectedGoal, progress: newProgress, status: isNowCompleted ? 'completed' : selectedGoal.status });
    }

    // Show confetti on completion
    if (!wasCompleted && isNowCompleted) {
      setShowConfetti(true);
    }
  };

  const handleToggleHabit = (habitId: number) => {
    if (!selectedGoal) return;

    const relatedHabits = selectedGoal.relatedHabits || [];
    const newRelatedHabits = relatedHabits.includes(habitId)
      ? relatedHabits.filter(id => id !== habitId)
      : [...relatedHabits, habitId];

    setGoals(prev => prev.map(g =>
      g.id === selectedGoal.id
        ? { ...g, relatedHabits: newRelatedHabits }
        : g
    ));

    setSelectedGoal({ ...selectedGoal, relatedHabits: newRelatedHabits });
  };

  const handleExportImage = async () => {
    if (!boardRef.current) return;

    // Use html2canvas if available, otherwise just export JSON
    try {
      // Simple fallback: export as JSON
      exportGoalsData(goals, 'vision-board-export.json');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Filter and search goals
  const filteredGoals = goals.filter(goal => {
    // Status filter
    if (filterMode === 'active' && goal.status !== 'active') return false;
    if (filterMode === 'completed' && goal.status !== 'completed') return false;
    if (goal.status === 'archived') return false;

    // Category filter
    if (selectedCategory !== 'all' && goal.category !== selectedCategory) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        goal.title.toLowerCase().includes(query) ||
        goal.why.toLowerCase().includes(query) ||
        goal.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Group by category for category view
  const goalsByCategory = filteredGoals.reduce((acc, goal) => {
    const cat = goal.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  const categories: (LifeAreaCategory | 'uncategorized')[] = ['health', 'career', 'finance', 'mind', 'relationships', 'contribution', 'uncategorized'];

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Stats Widget */}
      <VisionBoardStats goals={goals} />

      {/* Main Vision Board */}
      <Card
        title="Vision Board"
        actions={
          <div className="flex gap-2">
            {/* Layout Toggle */}
            <select
              value={layoutMode}
              onChange={e => setLayoutMode(e.target.value as LayoutMode)}
              className="bg-slate-700 text-slate-200 px-3 py-1 rounded-md text-sm border-none"
            >
              <option value="grid">Grid View</option>
              <option value="category">By Category</option>
            </select>

            {/* Export */}
            <button
              onClick={handleExportImage}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Export
            </button>

            {/* Import */}
            <button
              onClick={() => importGoalsData<Goal[]>(setGoals)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Import
            </button>

            {/* Templates */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              Templates
            </button>
          </div>
        }
      >
        {/* Filters */}
        <div className="mb-4 space-y-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700/50 text-slate-200 px-4 py-2 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          {/* Status and Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                filterMode === 'all' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All ({goals.filter(g => g.status !== 'archived').length})
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                filterMode === 'active' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Active ({goals.filter(g => g.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                filterMode === 'completed' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Completed ({goals.filter(g => g.status === 'completed').length})
            </button>

            <div className="h-6 w-px bg-slate-600 mx-1" />

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as LifeAreaCategory | 'all')}
              className="bg-slate-700 text-slate-200 px-3 py-1 rounded-md text-sm border-none"
            >
              <option value="all">All Categories</option>
              <option value="health">Health</option>
              <option value="career">Career</option>
              <option value="finance">Finance</option>
              <option value="mind">Mind</option>
              <option value="relationships">Relationships</option>
              <option value="contribution">Contribution</option>
            </select>
          </div>
        </div>

        {/* Goals Grid/Category View */}
        <div ref={boardRef}>
          {layoutMode === 'grid' ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredGoals.map(g => g.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredGoals.map(goal => (
                    <SortableGoalCard
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
                      <p className="mt-2 text-sm font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Add Goal
                      </p>
                    </div>
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-6">
              {categories.map(cat => {
                const catGoals = goalsByCategory[cat] || [];
                if (catGoals.length === 0) return null;

                return (
                  <div key={cat}>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3 capitalize flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                      {cat.replace('-', ' ')} ({catGoals.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {catGoals.map(goal => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onClick={() => setSelectedGoal(goal)}
                          habits={habits}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredGoals.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p>No goals found. Create your first vision!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* View/Edit Goal Modal - Enhanced with Habit Linking */}
      <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)}>
        {selectedGoal && (
          <div className="p-0 max-h-[80vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedGoal.imageUrl} alt={selectedGoal.title} className="w-full h-64 object-cover rounded-t-lg" />
              {selectedGoal.status === 'completed' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Completed
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-cyan-300 mb-2">{selectedGoal.title}</h2>
                {selectedGoal.category && (
                  <span className="inline-block bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                    {selectedGoal.category.charAt(0).toUpperCase() + selectedGoal.category.slice(1)}
                  </span>
                )}
              </div>

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
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdateProgress(selectedGoal.id, Math.min((selectedGoal.progress || 0) + 10, 100))}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    +10%
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(selectedGoal.id, Math.max((selectedGoal.progress || 0) - 10, 0))}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    -10%
                  </button>
                  {selectedGoal.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateProgress(selectedGoal.id, 100)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Link Habits Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Link Habits</h3>
                <div className="space-y-2">
                  {habits.map(habit => {
                    const isLinked = selectedGoal.relatedHabits?.includes(habit.id);
                    return (
                      <button
                        key={habit.id}
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          isLinked
                            ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-300'
                            : 'bg-slate-700/50 border-2 border-transparent text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-cyan-300">{habit.icon}</span>
                        <span className="flex-1 text-left">{habit.name}</span>
                        {isLinked && <span className="text-xs font-semibold">✓ Linked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

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

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                {selectedGoal.status === 'completed' ? (
                  <button
                    onClick={() => {
                      setGoals(prev => prev.map(g =>
                        g.id === selectedGoal.id ? { ...g, status: 'active' } : g
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

      {/* Add Goal Modal - Same as before but with habit linking */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Create a New Vision</h2>
          <form onSubmit={handleAddGoal} className="space-y-4">
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

            {/* Link Habits */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Link Habits (Optional)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {habits.map(habit => (
                  <label key={habit.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGoalRelatedHabits.includes(habit.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNewGoalRelatedHabits([...newGoalRelatedHabits, habit.id]);
                        } else {
                          setNewGoalRelatedHabits(newGoalRelatedHabits.filter(id => id !== habit.id));
                        }
                      }}
                      className="rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="text-cyan-300">{habit.icon}</span>
                    <span className="text-slate-300">{habit.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Goal Image</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageUploadMode('ai')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    imageUploadMode === 'ai' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  AI Generate
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode('upload')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    imageUploadMode === 'upload' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode('url')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    imageUploadMode === 'url' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  URL
                </button>
              </div>

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

              {imageUploadMode === 'upload' && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-slate-700/50 rounded-md border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 px-3 py-2 text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400"
                />
              )}

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

      {/* Template Modal */}
      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Choose a Template</h2>
          <div className="space-y-3">
            {VISION_BOARD_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleApplyTemplate(template.id)}
                disabled={isGenerating}
                className="w-full text-left bg-slate-700/50 hover:bg-slate-700 p-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                    <p className="text-xs text-cyan-300">{template.goals.length} goals included</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {isGenerating && (
            <div className="mt-4 text-center">
              <Loader />
              <p className="text-sm text-slate-400 mt-2">Generating images for template goals...</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default VisionBoardEnhanced;
