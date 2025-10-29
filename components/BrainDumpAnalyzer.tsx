
import React, { useState } from 'react';
import { analyzeBrainDump } from '../services/geminiService';
import Loader from './Loader';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-indigo-300 mb-4">{title}</h2>
        {children}
    </div>
);

const parseMarkdown = (text: string): { __html: string } => {
    let html = text
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-indigo-200 mt-4 mb-2">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-indigo-300 mt-3 mb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-indigo-200 mt-2 mb-1">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/\n\s*-\s/g, '<ul><li>')
        .replace(/(\n\s*-\s)/g, '</li><li>')
        .replace(/<\/li><li>$/, '</li></ul>');
    
    // This crude list handling needs a closing tag if the text ends in a list
    if (html.includes('<li>') && !html.endsWith('</ul>')) {
        html += '</li></ul>';
    }

    return { __html: html.replace(/\n/g, '<br/>') };
};


const BrainDumpAnalyzer: React.FC = () => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setAnalysis('');
        const result = await analyzeBrainDump(text);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <Card title="Brain Dump Analyzer">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Pour your thoughts here... projects, ideas, worries—anything."
                className="w-full h-48 bg-slate-700/30 rounded-md border-slate-600 focus:border-indigo-400 focus:ring-indigo-400 focus:ring-opacity-50 resize-y text-sm mb-4"
                disabled={loading}
            />
            <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="w-full bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-400 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? <Loader /> : "Analyze My Thoughts"}
            </button>
            
            {analysis && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-indigo-200 mb-2">Analysis Results:</h3>
                    <div className="prose prose-invert prose-sm text-slate-300 bg-slate-900/50 p-4 rounded-md" dangerouslySetInnerHTML={parseMarkdown(analysis)} />
                </div>
            )}
        </Card>
    );
};

export default BrainDumpAnalyzer;
