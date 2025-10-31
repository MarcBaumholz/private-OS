import React, { useState } from 'react';
import Header from './components/Header';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import ProfileView from './components/ProfileView';
import type { View, Habit, Todo, CalendarEvent, WeeklyGoal, Goal } from './types';
import { INITIAL_HABITS, INITIAL_CALENDAR_EVENTS, INITIAL_WEEKLY_GOALS, INITIAL_GOALS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('daily');

  // State lifted up to be shared across views
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS.map(h => ({ ...h, completed: false })));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(INITIAL_WEEKLY_GOALS);

  // Use localStorage for goals persistence
  const [goals, setGoals] = useLocalStorage<Goal[]>('lifeOS-vision-board-goals', INITIAL_GOALS);

  const renderView = () => {
    switch(activeView) {
      case 'daily':
        return (
          <DailyView
            habits={habits}
            setHabits={setHabits}
            todos={todos}
            setTodos={setTodos}
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            calendarEvents={calendarEvents}
            setCalendarEvents={setCalendarEvents}
            weeklyGoals={weeklyGoals}
            goals={goals}
            setGoals={setGoals}
          />
        );
      case 'weekly':
        return (
          <WeeklyView
            habits={habits}
            setHabits={setHabits}
            weeklyGoals={weeklyGoals}
            setWeeklyGoals={setWeeklyGoals}
          />
        );
      case 'profile':
        return <ProfileView goals={goals} setGoals={setGoals} habits={habits} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="transition-opacity duration-500">
        {renderView()}
      </main>
    </div>
  );
};

export default App;