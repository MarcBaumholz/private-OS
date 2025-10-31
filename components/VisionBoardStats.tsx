import React from 'react';
import type { Goal, LifeAreaCategory } from '../types';

interface VisionBoardStatsProps {
  goals: Goal[];
}

const VisionBoardStats: React.FC<VisionBoardStatsProps> = ({ goals }) => {
  // Calculate stats
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0;

  // Find most progressed goal this week (simplified: highest progress active goal)
  const mostProgressedGoal = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

  // Calculate life area balance
  const categoryCount: Record<LifeAreaCategory | 'none', number> = {
    health: 0,
    career: 0,
    finance: 0,
    mind: 0,
    relationships: 0,
    contribution: 0,
    none: 0
  };

  goals.forEach(g => {
    const cat = g.category || 'none';
    categoryCount[cat]++;
  });

  const categoryColors: Record<LifeAreaCategory, string> = {
    health: '#fb7185', // rose-400
    career: '#818cf8', // indigo-400
    finance: '#34d399', // emerald-400
    mind: '#c084fc', // purple-400
    relationships: '#f9a8d4', // pink-400
    contribution: '#fbbf24' // amber-400
  };

  const categories: LifeAreaCategory[] = ['health', 'career', 'finance', 'mind', 'relationships', 'contribution'];
  const maxCount = Math.max(...Object.values(categoryCount));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-cyan-300 mb-4">Vision Board Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Goals */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400">{goals.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total Goals</div>
        </div>

        {/* Active Goals */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{activeGoals}</div>
          <div className="text-sm text-slate-400 mt-1">Active</div>
        </div>

        {/* Completed Goals */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{completedGoals}</div>
          <div className="text-sm text-slate-400 mt-1">Completed</div>
        </div>

        {/* Average Progress */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{totalProgress}%</div>
          <div className="text-sm text-slate-400 mt-1">Avg Progress</div>
        </div>
      </div>

      {/* Most Progressed Goal */}
      {mostProgressedGoal && (
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">🏆 Top Progressed Goal</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-200">{mostProgressedGoal.title}</span>
            <span className="text-cyan-400 font-bold">{mostProgressedGoal.progress}%</span>
          </div>
        </div>
      )}

      {/* Life Area Balance Chart */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Life Area Balance</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const count = categoryCount[cat];
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="capitalize">{cat.replace('-', ' ')}</span>
                  <span>{count} goal{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: categoryColors[cat]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Balance Insights */}
      {goals.length > 0 && (
        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-cyan-300">
            {categoryCount.none > 0 && `💡 ${categoryCount.none} goal${categoryCount.none > 1 ? 's' : ''} need${categoryCount.none === 1 ? 's' : ''} a category!`}
            {categoryCount.none === 0 && Object.values(categoryCount).every(c => c > 0)
              ? '✨ Perfect balance! All life areas covered.'
              : categoryCount.none === 0 && `💭 Consider adding goals to: ${categories.filter(c => categoryCount[c] === 0).join(', ')}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VisionBoardStats;
