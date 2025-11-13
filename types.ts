// Fix: Added import for ReactNode to fix 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export type View = 'daily' | 'weekly' | 'profile' | 'journal';

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

// Journal Types
export type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'quote'
  | 'callout'
  | 'code'
  | 'divider';

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  text?: string;
  level?: number; // For headings (1, 2, 3)
  checked?: boolean; // For to_do items
  icon?: string; // For callouts
  language?: string; // For code blocks
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string | null; // ISO date string
  mood: number | null; // 1-10
  sleepQuality: string;
  priority: string[];
  content: NotionBlock[];
  notionUrl: string;
  lastEdited: string; // ISO datetime string
  createdTime: string; // ISO datetime string
}

export interface JournalData {
  entries: JournalEntry[];
  lastSync: string; // ISO datetime string
  totalEntries: number;
}