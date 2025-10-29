import React from 'react';
import WeeklyCheckIn from './WeeklyCheckIn';
import BrainDumpAnalyzer from './BrainDumpAnalyzer';
import WeeklyGoalProgress from './WeeklyGoalProgress';
import WeeklyHabitOverview from './WeeklyHabitOverview';
import type { Habit, WeeklyGoal } from '../types';

interface WeeklyViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  weeklyGoals: WeeklyGoal[];
  setWeeklyGoals: React.Dispatch<React.SetStateAction<WeeklyGoal[]>>;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ habits, setHabits, weeklyGoals, setWeeklyGoals }) => {
  // Mock data for WeeklyCheckIn, as its original props are no longer passed down from App
  const dataForCheckIn = { 
    habits, 
    todos: [], // Passing empty todos for mock
    journalEntry: "This week was focused on execution and planning for the next sprint." 
  };
  
  const handleToggleWeeklyGoal = (id: number) => {
    setWeeklyGoals(goals => goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <WeeklyGoalProgress goals={weeklyGoals} onToggleGoal={handleToggleWeeklyGoal} />
      <WeeklyHabitOverview habits={habits} />
      <WeeklyCheckIn data={dataForCheckIn} />
      <BrainDumpAnalyzer />
    </div>
  );
};

export default WeeklyView;
