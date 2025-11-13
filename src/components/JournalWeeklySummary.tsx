import React from 'react';
import type { JournalEntry } from '../types';

interface JournalWeeklySummaryProps {
  entries: JournalEntry[];
  onEntryClick?: (entry: JournalEntry) => void;
}

/**
 * Displays a 7-day grid summary of journal entries
 */
export function JournalWeeklySummary({ entries, onEntryClick }: JournalWeeklySummaryProps) {
  // Get the last 7 days
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const days = getLast7Days();

  // Get entry for a specific day
  const getEntryForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return entries.find((entry) => entry.date?.startsWith(dateString));
  };

  // Format day label
  const formatDayLabel = (date: Date, isToday: boolean) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return (
      <div className="text-center">
        <div className={`text-xs font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {dayName}
        </div>
        <div className={`text-lg font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {dayNum}
        </div>
      </div>
    );
  };

  // Get mood emoji
  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return '😐';
    const moodMap: Record<number, string> = {
      1: '😢',
      2: '😔',
      3: '😕',
      4: '😐',
      5: '🙂',
      6: '😊',
      7: '😄',
      8: '😁',
      9: '🤩',
      10: '🎉',
    };
    return moodMap[mood] || '😐';
  };

  // Get preview text
  const getPreviewText = (entry: JournalEntry) => {
    const textBlocks = entry.content
      .filter((block) => block.type === 'paragraph' && block.text)
      .slice(0, 2);

    if (textBlocks.length === 0) return 'No content';

    const preview = textBlocks
      .map((block) => block.text || '')
      .join(' ')
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove markdown
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1');

    return preview.length > 80 ? preview.slice(0, 80) + '...' : preview;
  };

  // Get word count
  const getWordCount = (entry: JournalEntry) => {
    const text = entry.content
      .map((block) => block.text || '')
      .join(' ');
    return text.split(/\s+/).filter(Boolean).length;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Weekly Journal Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((date, idx) => {
          const entry = getEntryForDay(date);
          const isToday = date.getTime() === today.getTime();

          return (
            <div
              key={idx}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${entry ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer' : 'bg-gray-100 dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-700'}
                ${isToday ? 'ring-2 ring-blue-400 dark:ring-blue-600' : ''}
              `}
              onClick={() => entry && onEntryClick?.(entry)}
            >
              {/* Day label */}
              <div className="mb-3">
                {formatDayLabel(date, isToday)}
              </div>

              {entry ? (
                <>
                  {/* Mood */}
                  <div className="flex justify-center mb-2">
                    <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col gap-1 text-xs text-center text-gray-600 dark:text-gray-400 mb-2">
                    {entry.mood !== null && (
                      <div>Mood: {entry.mood}/10</div>
                    )}
                    <div>{getWordCount(entry)} words</div>
                  </div>

                  {/* Preview (hidden on mobile) */}
                  <div className="hidden lg:block text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                    {getPreviewText(entry)}
                  </div>

                  {/* Priority badges */}
                  {entry.priority.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.priority.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs">No entry</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {entries.filter((e) => {
                const entryDate = e.date ? new Date(e.date) : null;
                return entryDate && entryDate >= days[0] && entryDate <= days[6];
              }).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {(() => {
                const weekEntries = entries.filter((e) => {
                  const entryDate = e.date ? new Date(e.date) : null;
                  return entryDate && entryDate >= days[0] && entryDate <= days[6];
                });
                const avgMood = weekEntries.length > 0
                  ? (weekEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / weekEntries.length).toFixed(1)
                  : 'N/A';
                return avgMood;
              })()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Mood</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {entries
                .filter((e) => {
                  const entryDate = e.date ? new Date(e.date) : null;
                  return entryDate && entryDate >= days[0] && entryDate <= days[6];
                })
                .reduce((sum, e) => sum + getWordCount(e), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round((entries.filter((e) => {
                const entryDate = e.date ? new Date(e.date) : null;
                return entryDate && entryDate >= days[0] && entryDate <= days[6];
              }).length / 7) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
