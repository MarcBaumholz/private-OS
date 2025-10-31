// Fix: Added import for ReactNode to fix 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export type View = 'daily' | 'weekly' | 'profile';

export type GoalStatus = 'active' | 'completed' | 'archived';

export type LifeAreaCategory = 'health' | 'career' | 'finance' | 'mind' | 'relationships' | 'contribution';

export interface Goal {
  id: number;
  title: string;
  imageUrl: string; // Can be a URL or a base64 data URI
  why: string;
  imagePrompt?: string;
  // Enhanced fields for vision board builder
  category?: LifeAreaCategory;
  progress?: number; // 0-100
  relatedHabits?: number[]; // Array of Habit IDs
  status?: GoalStatus;
  createdAt?: string; // ISO date string
  targetDate?: string; // ISO date string
  tags?: string[];
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