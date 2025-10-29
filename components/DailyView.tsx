import React from 'react';
import HabitTracker from './HabitTracker';
import DailyPlanner from './DailyPlanner';
import TodoList from './TodoList';
import Journal from './Journal';
import DailyBrief from './DailyBrief';
import VisionBoard from './VisionBoard';
import type { Habit, Todo, CalendarEvent, WeeklyGoal, Goal } from '../types';

interface DailyViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  journalEntry: string;
  setJournalEntry: React.Dispatch<React.SetStateAction<string>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  weeklyGoals: WeeklyGoal[];
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const DailyView: React.FC<DailyViewProps> = ({
  habits,
  setHabits,
  todos,
  setTodos,
  journalEntry,
  setJournalEntry,
  calendarEvents,
  weeklyGoals,
  goals,
  setGoals,
}) => {

  const handleToggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };
  
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <HabitTracker habits={habits} onToggleHabit={handleToggleHabit} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-6">
        <div className="min-h-[600px]"><DailyPlanner events={calendarEvents} /></div>
        <div className="min-h-[600px]">
            <TodoList 
                todos={todos} 
                onAddTodo={handleAddTodo} 
                onToggleTodo={handleToggleTodo} 
                weeklyGoals={weeklyGoals}
                calendarEvents={calendarEvents}
            />
        </div>
      </div>
      
      <VisionBoard goals={goals} setGoals={setGoals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-h-[300px]"><DailyBrief /></div>
        <div className="min-h-[300px]">
            <Journal 
                journalEntry={journalEntry} 
                onUpdateJournal={setJournalEntry}
                habits={habits}
            />
        </div>
      </div>
    </div>
  );
};

export default DailyView;