import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { JournalEntryCard } from './JournalEntryCard';
import { JournalWeeklySummary } from './JournalWeeklySummary';

interface JournalViewProps {
  entries: JournalEntry[];
  lastSync: string | null;
  onRefresh: () => void;
}

type JournalTab = 'daily' | 'weekly' | 'all';

/**
 * Main Journal view with tabs for daily, weekly, and all entries
 */
export function JournalView({ entries, lastSync, onRefresh }: JournalViewProps) {
  const [activeTab, setActiveTab] = useState<JournalTab>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const scrollRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Get today's entry
  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find((entry) => entry.date?.startsWith(today));
  }, [entries]);

  // Get this week's entries
  const weekEntries = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    return entries.filter((entry) => {
      if (!entry.date) return false;
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart;
    });
  }, [entries]);

  // Filter entries based on search and mood
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.some((block) => block.text?.toLowerCase().includes(query))
      );
    }

    // Mood filter
    if (selectedMood !== null) {
      filtered = filtered.filter((entry) => entry.mood === selectedMood);
    }

    return filtered;
  }, [entries, searchQuery, selectedMood]);

  // Scroll to entry
  const scrollToEntry = (entry: JournalEntry) => {
    setActiveTab('all');
    setTimeout(() => {
      const element = scrollRefs.current.get(entry.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-blue-400', 'dark:ring-blue-600');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-blue-400', 'dark:ring-blue-600');
        }, 2000);
      }
    }, 100);
  };

  // Format last sync time
  const formatLastSync = (syncTime: string | null) => {
    if (!syncTime) return 'Never';
    const date = new Date(syncTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              📔 Journal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your daily reflections synced from Notion
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last synced: {formatLastSync(lastSync)}
            </div>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'daily'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'weekly'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All Entries ({entries.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'daily' && (
        <div>
          {todayEntry ? (
            <JournalEntryCard entry={todayEntry} />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No entry for today
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start journaling in Notion to see it here
              </p>
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.635-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                </svg>
                Open Notion
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div>
          <JournalWeeklySummary entries={weekEntries} onEntryClick={scrollToEntry} />
        </div>
      )}

      {activeTab === 'all' && (
        <div>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedMood ?? ''}
              onChange={(e) => setSelectedMood(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Moods</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                <option key={mood} value={mood}>
                  Mood {mood}/10
                </option>
              ))}
            </select>
            {(searchQuery || selectedMood) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMood(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Entries list */}
          {filteredEntries.length > 0 ? (
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  ref={(el) => {
                    if (el) scrollRefs.current.set(entry.id, el);
                  }}
                  className="transition-all duration-300"
                >
                  <JournalEntryCard entry={entry} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No entries found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || selectedMood
                  ? 'Try adjusting your filters'
                  : 'Start journaling in Notion to see entries here'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
