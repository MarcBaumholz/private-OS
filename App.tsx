import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import ProfileView from './components/ProfileView';
import { JournalView } from './src/components/JournalView';
import type { View, Habit, Todo, CalendarEvent, WeeklyGoal, Goal, JournalEntry } from './types';
import { INITIAL_HABITS, INITIAL_CALENDAR_EVENTS, INITIAL_WEEKLY_GOALS, INITIAL_GOALS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchJournalEntries } from './src/services/notionService';

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

  // Journal state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoadingJournal, setIsLoadingJournal] = useState(false);

  // Fetch journal entries on mount and periodically
  const loadJournalEntries = async () => {
    setIsLoadingJournal(true);
    try {
      const data = await fetchJournalEntries();
      setJournalEntries(data.entries);
      setLastSync(data.lastSync);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setIsLoadingJournal(false);
    }
  };

  useEffect(() => {
    loadJournalEntries();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadJournalEntries, 30000);
    return () => clearInterval(interval);
  }, []);

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
      case 'journal':
        return (
          <JournalView
            entries={journalEntries}
            lastSync={lastSync}
            onRefresh={loadJournalEntries}
          />
        );
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