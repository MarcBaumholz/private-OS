import type { JournalData, JournalEntry } from '../types';

/**
 * Fetches journal entries from the generated JSON file
 */
export async function fetchJournalEntries(): Promise<JournalData> {
  try {
    const response = await fetch('/private-OS/data/journal-entries.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch journal entries: ${response.statusText}`);
    }

    const data: JournalData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching journal entries:', error);

    // Return empty data on error
    return {
      entries: [],
      lastSync: null,
      totalEntries: 0,
    };
  }
}

/**
 * Gets a journal entry by date
 */
export function getEntryByDate(entries: JournalEntry[], date: string): JournalEntry | null {
  const dateString = new Date(date).toISOString().split('T')[0];
  return entries.find((entry) => entry.date?.startsWith(dateString)) || null;
}

/**
 * Gets journal entries for a specific week
 */
export function getWeekEntries(entries: JournalEntry[], weekStart: Date): JournalEntry[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return entries.filter((entry) => {
    if (!entry.date) return false;
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
}

/**
 * Gets entries filtered by mood
 */
export function getEntriesByMood(entries: JournalEntry[], mood: number): JournalEntry[] {
  return entries.filter((entry) => entry.mood === mood);
}

/**
 * Searches entries by text
 */
export function searchEntries(entries: JournalEntry[], query: string): JournalEntry[] {
  const lowerQuery = query.toLowerCase();

  return entries.filter((entry) => {
    // Search in title
    if (entry.title.toLowerCase().includes(lowerQuery)) return true;

    // Search in content
    return entry.content.some((block) => block.text?.toLowerCase().includes(lowerQuery));
  });
}

/**
 * Gets mood statistics
 */
export function getMoodStats(entries: JournalEntry[]): {
  average: number;
  highest: number;
  lowest: number;
  distribution: Record<number, number>;
} {
  const entriesWithMood = entries.filter((e) => e.mood !== null);

  if (entriesWithMood.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      distribution: {},
    };
  }

  const moods = entriesWithMood.map((e) => e.mood!);
  const sum = moods.reduce((a, b) => a + b, 0);
  const average = sum / moods.length;
  const highest = Math.max(...moods);
  const lowest = Math.min(...moods);

  // Count distribution
  const distribution: Record<number, number> = {};
  moods.forEach((mood) => {
    distribution[mood] = (distribution[mood] || 0) + 1;
  });

  return {
    average: Math.round(average * 10) / 10,
    highest,
    lowest,
    distribution,
  };
}
