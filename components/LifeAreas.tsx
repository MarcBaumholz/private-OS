import React from 'react';
import { LIFE_AREAS } from '../constants';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">{title}</h2>
        {children}
    </div>
);

const LifeAreas: React.FC = () => {
    return (
        <Card title="My Life Areas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LIFE_AREAS.map((area) => (
                    <div key={area.id} className="bg-slate-900/50 p-4 rounded-lg transition-transform hover:scale-105 hover:bg-slate-900/80">
                        <div className="flex items-center mb-2">
                             {React.cloneElement(area.icon as React.ReactElement, { className: "w-6 h-6 text-cyan-400"})}
                            <h3 className="font-bold text-cyan-200 ml-3 text-lg">{area.name}</h3>
                        </div>
                        <p className="text-slate-400 text-sm">{area.description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LifeAreas;
