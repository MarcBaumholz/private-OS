import React from 'react';
import type { JournalEntry } from '../types';
import { NotionBlockRenderer } from './NotionBlockRenderer';

interface JournalEntryCardProps {
  entry: JournalEntry;
  preview?: boolean; // If true, show only first few lines
}

/**
 * Displays a single journal entry in a card format
 */
export function JournalEntryCard({ entry, preview = false }: JournalEntryCardProps) {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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

  // Get mood color for border
  const getMoodColor = (mood: number | null) => {
    if (mood === null) return 'border-gray-300';
    if (mood <= 3) return 'border-red-400';
    if (mood <= 5) return 'border-yellow-400';
    if (mood <= 7) return 'border-blue-400';
    return 'border-green-400';
  };

  // Calculate word count
  const getWordCount = () => {
    const text = entry.content
      .map((block) => block.text || '')
      .join(' ');
    return text.split(/\s+/).filter(Boolean).length;
  };

  // Get preview content (first 2-3 blocks)
  const previewContent = preview ? entry.content.slice(0, 3) : entry.content;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md border-l-4 ${getMoodColor(entry.mood)} overflow-hidden transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {entry.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📅 {formatDate(entry.date)}
            </p>
          </div>
          <a
            href={entry.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Open in Notion"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.635-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
            </svg>
          </a>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-sm">
          {entry.mood !== null && (
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
              <span className="text-gray-600 dark:text-gray-400">
                Mood: {entry.mood}/10
              </span>
            </div>
          )}
          {entry.sleepQuality && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <span>💤</span>
              <span>Sleep: {entry.sleepQuality}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <span>📝</span>
            <span>{getWordCount()} words</span>
          </div>
        </div>

        {/* Priority tags */}
        {entry.priority.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {entry.priority.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <NotionBlockRenderer blocks={previewContent} />

        {preview && entry.content.length > 3 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            ... {entry.content.length - 3} more blocks
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Last edited: {new Date(entry.lastEdited).toLocaleDateString()} at{' '}
        {new Date(entry.lastEdited).toLocaleTimeString()}
      </div>
    </div>
  );
}
