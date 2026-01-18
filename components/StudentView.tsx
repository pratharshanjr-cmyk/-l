
import React, { useState } from 'react';
import { Trophy, Clock, Mic, Star, Zap, User } from 'lucide-react';
import { ChildProfile, Level, StudySession } from '../types';
import StudyTimer from './StudyTimer';
import VoiceRecorder from './VoiceRecorder';
import CertificateView from './CertificateView';
import { XP_PER_SESSION, LEVEL_THRESHOLDS } from '../constants';

interface StudentViewProps {
  child: ChildProfile;
  onXPUpdate: (xp: number, session: StudySession) => void;
  onRecordingAdd: (recording: any) => void;
  parentPin: string;
  referenceFace: string | null;
}

const StudentView: React.FC<StudentViewProps> = ({ child, onXPUpdate, onRecordingAdd, parentPin, referenceFace }) => {
  const [activeTab, setActiveTab] = useState<'study' | 'rewards' | 'homework'>('study');
  const levelInfo = LEVEL_THRESHOLDS.find(t => t.level === child.level);

  const progressPercentage = Math.min(
    100, 
    ((child.xp - (levelInfo?.min || 0)) / ((levelInfo?.max || 1000) - (levelInfo?.min || 0))) * 100
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-lg animate-float">
          <User size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {child.name}!</h1>
          <p className="text-slate-500 font-medium">{child.standard} • {child.school}</p>
          
          <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-amber-100">
              <Star size={18} fill="currentColor" />
              {child.xp} XP Total
            </div>
            <div className={`text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm ${levelInfo?.color}`}>
              <Zap size={18} fill="currentColor" />
              Level: {child.level}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Level Progress</span>
          <span className="text-sm font-bold text-indigo-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('study')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'study' ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Clock size={20} />
          Study Timer
        </button>
        <button 
          onClick={() => setActiveTab('homework')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'homework' ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Mic size={20} />
          Homework
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'rewards' ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Trophy size={20} />
          Rewards
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'study' && (
          <StudyTimer 
            onComplete={(subject, duration) => {
              const session: StudySession = {
                id: Math.random().toString(36).substr(2, 9),
                subject,
                duration,
                timestamp: Date.now(),
                xpEarned: XP_PER_SESSION
              };
              onXPUpdate(XP_PER_SESSION, session);
            }} 
            parentPin={parentPin}
            referenceFace={referenceFace}
          />
        )}
        {activeTab === 'homework' && (
          <VoiceRecorder onSave={onRecordingAdd} />
        )}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEVEL_THRESHOLDS.map(l => {
              const unlocked = child.certificates.includes(l.level) || l.level === Level.BRONZE;
              return (
                <div key={l.level} className={`relative p-6 rounded-3xl border ${unlocked ? 'bg-white border-indigo-100' : 'bg-slate-50 border-slate-200 grayscale opacity-75'}`}>
                  <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-white ${l.color}`}>
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{l.level} Rank</h3>
                  <p className="text-slate-500 mb-6 text-sm">Target: {l.min} XP</p>
                  
                  {unlocked ? (
                    <CertificateView child={child} level={l.level} />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest">
                       Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
