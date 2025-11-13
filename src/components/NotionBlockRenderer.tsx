import React from 'react';
import type { NotionBlock } from '../types';

interface NotionBlockRendererProps {
  blocks: NotionBlock[];
}

/**
 * Renders Notion-style blocks with proper formatting
 */
export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  const renderBlock = (block: NotionBlock, index: number) => {
    const key = `${block.id}-${index}`;

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={key} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderText(block.text || '')}
          </p>
        );

      case 'heading_1':
        return (
          <h1 key={key} className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">
            {renderText(block.text || '')}
          </h1>
        );

      case 'heading_2':
        return (
          <h2 key={key} className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">
            {renderText(block.text || '')}
          </h2>
        );

      case 'heading_3':
        return (
          <h3 key={key} className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-gray-200">
            {renderText(block.text || '')}
          </h3>
        );

      case 'bulleted_list_item':
        return (
          <li key={key} className="ml-6 mb-1 text-gray-700 dark:text-gray-300 list-disc">
            {renderText(block.text || '')}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li key={key} className="ml-6 mb-1 text-gray-700 dark:text-gray-300 list-decimal">
            {renderText(block.text || '')}
          </li>
        );

      case 'to_do':
        return (
          <div key={key} className="flex items-start gap-2 mb-2">
            <input
              type="checkbox"
              checked={block.checked || false}
              readOnly
              className="mt-1 w-4 h-4 rounded border-gray-300"
            />
            <span className={`text-gray-700 dark:text-gray-300 ${block.checked ? 'line-through opacity-60' : ''}`}>
              {renderText(block.text || '')}
            </span>
          </div>
        );

      case 'quote':
        return (
          <blockquote
            key={key}
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-3 italic text-gray-600 dark:text-gray-400"
          >
            {renderText(block.text || '')}
          </blockquote>
        );

      case 'callout':
        return (
          <div
            key={key}
            className="flex gap-3 p-4 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <span className="text-2xl flex-shrink-0">{block.icon || '💡'}</span>
            <div className="flex-1 text-gray-700 dark:text-gray-300">
              {renderText(block.text || '')}
            </div>
          </div>
        );

      case 'code':
        return (
          <pre
            key={key}
            className="mb-3 p-4 bg-gray-900 dark:bg-black text-gray-100 rounded-lg overflow-x-auto"
          >
            <code className="text-sm font-mono">{block.text || ''}</code>
          </pre>
        );

      case 'divider':
        return <hr key={key} className="my-6 border-gray-300 dark:border-gray-700" />;

      default:
        return (
          <div key={key} className="mb-2 text-gray-700 dark:text-gray-300">
            {renderText(block.text || '')}
          </div>
        );
    }
  };

  /**
   * Renders formatted text with markdown-style formatting
   */
  const renderText = (text: string) => {
    if (!text) return null;

    // Split by formatting patterns and render accordingly
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regex patterns for bold, italic, code, strikethrough
    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, format: 'bold' },
      { regex: /\*(.+?)\*/g, format: 'italic' },
      { regex: /`(.+?)`/g, format: 'code' },
      { regex: /~~(.+?)~~/g, format: 'strikethrough' },
    ];

    // Simple text rendering with basic markdown support
    const processedText = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|~~.*?~~)/g);

    processedText.forEach((part, idx) => {
      if (!part) return;

      if (part.startsWith('**') && part.endsWith('**')) {
        parts.push(<strong key={`b-${idx}`}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith('*') && part.endsWith('*')) {
        parts.push(<em key={`i-${idx}`}>{part.slice(1, -1)}</em>);
      } else if (part.startsWith('`') && part.endsWith('`')) {
        parts.push(
          <code key={`c-${idx}`} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.startsWith('~~') && part.endsWith('~~')) {
        parts.push(<del key={`s-${idx}`}>{part.slice(2, -2)}</del>);
      } else {
        parts.push(part);
      }
    });

    return <>{parts}</>;
  };

  return (
    <div className="notion-blocks space-y-1">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
