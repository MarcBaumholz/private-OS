
import React, { useState, useEffect, useCallback } from 'react';
import { getDailyBrief } from '../services/geminiService';
import Loader from './Loader';
import { ArrowPathIcon } from './icons';

const Card: React.FC<{ children: React.ReactNode, title: string, onRefresh?: () => void }> = ({ children, title, onRefresh }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-300">{title}</h2>
            {onRefresh && (
                <button onClick={onRefresh} className="text-slate-400 hover:text-cyan-300 transition-colors">
                    <ArrowPathIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
);

const parseMarkdown = (text: string) => {
  const html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-cyan-200 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyan-300 mt-6 mb-3">$1</h2>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>')
    .replace(/\n/g, '<br />');

  return { __html: html };
};


const DailyBrief: React.FC = () => {
    const [brief, setBrief] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchBrief = useCallback(async () => {
        setLoading(true);
        const content = await getDailyBrief();
        setBrief(content);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchBrief();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card title="Daily Brief" onRefresh={fetchBrief}>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader />
                </div>
            ) : (
                <div className="prose prose-invert prose-sm text-slate-300" dangerouslySetInnerHTML={parseMarkdown(brief)} />
            )}
        </Card>
    );
};

export default DailyBrief;
