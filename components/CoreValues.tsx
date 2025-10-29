import React from 'react';
import { CORE_VALUES } from '../constants';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">{title}</h2>
        {children}
    </div>
);


const CoreValues: React.FC = () => {
    return (
        <Card title="My Core Values">
            <ul className="space-y-4">
                {CORE_VALUES.map((value) => (
                    <li key={value.id} className="p-3 bg-slate-900/50 rounded-lg">
                        <h3 className="font-bold text-cyan-200 text-lg">{value.value}</h3>
                        <p className="text-slate-400 mt-1">{value.statement}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default CoreValues;
