import React from 'react';
import type { Goal, Habit, WeeklyGoal, CalendarEvent, CoreValue, LifeArea } from './types';
import { 
    BookOpenIcon, DumbbellIcon, SunIcon, MoonIcon, DropletIcon, CheckCircleIcon, 
    BriefcaseIcon, BanknotesIcon, HeartIcon, SparklesIcon, AcademicCapIcon 
} from './components/icons';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    title: "Run a Marathon",
    imageUrl: "https://picsum.photos/seed/marathon/800/600",
    why: "To push my physical and mental limits, proving to myself that I can achieve monumental goals through discipline and perseverance."
  },
  {
    id: 2,
    title: "Learn a New Language",
    imageUrl: "https://picsum.photos/seed/language/800/600",
    why: "To connect with new cultures, expand my worldview, and challenge my mind in a completely new way."
  },
  {
    id: 3,
    title: "Launch a Side Project",
    imageUrl: "https://picsum.photos/seed/project/800/600",
    why: "To build something from the ground up, learn new skills in design and development, and create a potential new stream of income."
  },
  {
    id: 4,
    title: "Master a Musical Instrument",
    imageUrl: "https://picsum.photos/seed/music/800/600",
    why: "To express my creativity through music, enjoy the meditative process of practice, and be able to play my favorite songs."
  },
  {
    id: 5,
    title: "Travel to Southeast Asia",
    imageUrl: "https://picsum.photos/seed/travel/800/600",
    why: "To experience diverse cultures, taste incredible food, and see breathtaking landscapes that are completely different from my own."
  }
];

export const INITIAL_HABITS: Omit<Habit, 'completed'>[] = [
  { id: 1, name: "Morning Rise", icon: <SunIcon /> },
  { id: 2, name: "Workout", icon: <DumbbellIcon /> },
  { id: 3, name: "Hydrate", icon: <DropletIcon /> },
  { id: 4, name: "Read", icon: <BookOpenIcon /> },
  { id: 5, name: "Plan", icon: <CheckCircleIcon /> },
  { id: 6, name: "Wind-down", icon: <MoonIcon /> },
];

export const PLANNER_TIMES: string[] = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6; // From 6 AM to 10 PM (22:00)
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const INITIAL_WEEKLY_GOALS: WeeklyGoal[] = [
    { id: 1, text: "Complete design mockups for Project X", completed: false },
    { id: 2, text: "Go to the gym 3 times", completed: true },
    { id: 3, text: "Read 50 pages of 'Atomic Habits'", completed: false },
    { id: 4, text: "Meal prep for the week", completed: false },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 1, time: "09:00", duration: 2, title: "Deep Work: Project Phoenix", color: 'cyan' },
    { id: 2, time: "12:00", duration: 1, title: "Lunch & Walk", color: 'teal' },
    { id: 3, time: "14:00", duration: 1.5, title: "Team Sync Meeting", color: 'indigo' },
    { id: 4, time: "17:00", duration: 1, title: "Workout", color: 'rose' },
];

export const CORE_VALUES: CoreValue[] = [
    { id: 1, value: "Growth", statement: "I am dedicated to continuous learning and self-improvement, embracing challenges as opportunities to expand my knowledge and skills." },
    { id: 2, value: "Integrity", statement: "I act with honesty and adhere to strong moral principles, ensuring my actions align with my values." },
    { id: 3, value: "Discipline", statement: "I cultivate self-control and focus, consistently taking the actions necessary to achieve my long-term goals." },
    { id: 4, value: "Compassion", statement: "I strive to understand and connect with others, showing kindness and empathy in my interactions." },
];

export const LIFE_AREAS: LifeArea[] = [
    { id: 1, name: "Health & Fitness", description: "Nourishing my body and mind through exercise, nutrition, and mindfulness.", icon: <DumbbellIcon /> },
    { id: 2, name: "Career & Work", description: "Pursuing meaningful work, developing skills, and achieving professional growth.", icon: <BriefcaseIcon /> },
    { id: 3, name: "Finance & Wealth", description: "Managing my resources wisely to build a secure and prosperous future.", icon: <BanknotesIcon /> },
    { id: 4, name: "Mind & Intellect", description: "Expanding my knowledge and curiosity through reading, learning, and new experiences.", icon: <AcademicCapIcon /> },
    { id: 5, name: "Relationships", description: "Cultivating deep and meaningful connections with family, friends, and community.", icon: <HeartIcon /> },
    { id: 6, name: "Contribution", description: "Making a positive impact on the world and leaving a legacy of value.", icon: <SparklesIcon /> },
];