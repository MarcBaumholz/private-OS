import React from 'react';
import type { Goal, LifeAreaCategory, Habit } from '../types';
import { CheckCircleIcon } from './icons';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
  habits?: Habit[]; // For showing related habits count
}

// Category colors and labels
const categoryConfig: Record<LifeAreaCategory, { color: string; bgColor: string; label: string }> = {
  health: { color: 'text-rose-300', bgColor: 'bg-rose-500/80', label: 'Health' },
  career: { color: 'text-indigo-300', bgColor: 'bg-indigo-500/80', label: 'Career' },
  finance: { color: 'text-emerald-300', bgColor: 'bg-emerald-500/80', label: 'Finance' },
  mind: { color: 'text-purple-300', bgColor: 'bg-purple-500/80', label: 'Mind' },
  relationships: { color: 'text-pink-300', bgColor: 'bg-pink-500/80', label: 'Relationships' },
  contribution: { color: 'text-amber-300', bgColor: 'bg-amber-500/80', label: 'Contribution' }
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick, habits = [] }) => {
  const category = goal.category || 'mind';
  const categoryStyle = categoryConfig[category];
  const progress = goal.progress || 0;
  const isCompleted = goal.status === 'completed';

  // Calculate related habits count
  const relatedHabitsCount = goal.relatedHabits?.length || 0;
  const relatedHabitsNames = habits
    .filter(h => goal.relatedHabits?.includes(h.id))
    .map(h => h.name);

  // Progress ring calculation (SVG circle)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md aspect-[4/3] hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Goal Image */}
      <img
        src={goal.imageUrl}
        alt={goal.title}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          isCompleted ? 'brightness-110' : ''
        }`}
      />

      {/* Category Badge - Top Left */}
      {goal.category && (
        <div className={`absolute top-2 left-2 ${categoryStyle.bgColor} backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full opacity-90`}>
          {categoryStyle.label}
        </div>
      )}

      {/* Progress Ring - Top Right */}
      {progress > 0 && !isCompleted && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg width="60" height="60" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {/* Progress text */}
            <text
              x="30"
              y="30"
              textAnchor="middle"
              dy="7"
              fontSize="14"
              fontWeight="bold"
              fill="white"
              className="transform rotate-90"
              style={{ transformOrigin: '30px 30px' }}
            >
              {progress}%
            </text>
          </svg>
        </div>
      )}

      {/* Completed Checkmark - Top Right */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2 shadow-lg">
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Related Habits Badge - Bottom Right */}
      {relatedHabitsCount > 0 && (
        <div className="absolute bottom-2 right-2 bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {relatedHabitsCount} habit{relatedHabitsCount > 1 ? 's' : ''}
        </div>
      )}

      {/* Hover Overlay with Title and Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white text-sm font-bold mb-1">{goal.title}</h3>
        {goal.targetDate && (
          <p className="text-cyan-300 text-xs">
            Target: {new Date(goal.targetDate).toLocaleDateString()}
          </p>
        )}
        {relatedHabitsCount > 0 && (
          <p className="text-slate-300 text-xs mt-1 truncate">
            {relatedHabitsNames.join(', ')}
          </p>
        )}
      </div>

      {/* Tags (subtle, on hover) */}
      {goal.tags && goal.tags.length > 0 && (
        <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {goal.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="bg-slate-900/70 backdrop-blur-sm text-slate-200 text-[10px] px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Completion Overlay Effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
      )}
    </div>
  );
};

export default GoalCard;
