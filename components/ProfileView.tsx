import React from 'react';
import VisionBoard from './VisionBoard';
import CoreValues from './CoreValues';
import LifeAreas from './LifeAreas';
import type { Goal } from '../types';

interface ProfileViewProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ goals, setGoals }) => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-200">My Life Blueprint</h1>
      <CoreValues />
      <LifeAreas />
      <VisionBoard goals={goals} setGoals={setGoals}/>
    </div>
  );
};

export default ProfileView;