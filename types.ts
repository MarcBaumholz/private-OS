// Fix: Added import for ReactNode to fix 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export type View = 'daily' | 'weekly' | 'profile';

export interface Goal {
  id: number;
  title: string;
  imageUrl: string; // Can be a URL or a base64 data URI
  why: string;
  imagePrompt?: string;
}

export interface Habit {
  id: number;
  name: string;
  icon: ReactNode;
  completed: boolean;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type PlannerEntries = Record<string, string>;

export interface CalendarEvent {
  id: number;
  time: string; // e.g., "09:00"
  duration: number; // in hours
  title: string;
  color: 'cyan' | 'indigo' | 'teal' | 'rose';
}

export interface WeeklyGoal {
    id: number;
    text: string;
    completed: boolean;
}

export interface CoreValue {
    id: number;
    value: string;
    statement: string;
}

export interface LifeArea {
    id: number;
    name: string;
    description: string;
    icon: ReactNode;
}