
import React, { useState } from 'react';
import { Users, BarChart2, Star, Clock, ChevronRight, FileText, PlayCircle, ShieldCheck } from 'lucide-react';
import { ChildProfile, Level } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

interface ParentDashboardProps {
  children: ChildProfile[];
  onSwitch: (id: string) => void;
  parentPin: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ children, onSwitch, parentPin }) => {
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(children[0] || null);
  const [showPinUnlock, setShowPinUnlock] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (pinInput === parentPin) {
      setShowPinUnlock(false);
      setError('');
    } else {
      setError('Incorrect Pin');
    }
  };

  if (showPinUnlock) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center space-y-6">
        <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Parent Panel Locked</h2>
          <p className="text-slate-500 font-medium mt-1">Enter PIN to access child stats</p>
        </div>
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="Parent PIN" 
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-3xl tracking-widest p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none"
          />
          {error && <p className="text-rose-500 font-bold">{error}</p>}
          <button 
            onClick={handleUnlock}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Parent Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Monitoring {children.length} {children.length === 1 ? 'child' : 'children'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Children List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 px-2">Family Profiles</h3>
          <div className="space-y-3">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${selectedChild?.id === child.id ? 'bg-white border-indigo-600 shadow-md' : 'bg-white border-transparent hover:border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${LEVEL_THRESHOLDS.find(l => l.level === child.level)?.color || 'bg-slate-400'}`}>
                  {child.name[0]}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-900">{child.name}</p>
                  <p className="text-sm text-slate-500 font-medium">{child.level} Rank</p>
                </div>
                <ChevronRight size={20} className={selectedChild?.id === child.id ? 'text-indigo-600' : 'text-slate-300'} />
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="lg:col-span-2 space-y-6">
          {selectedChild ? (
            <>
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Star size={20} fill="currentColor" />
                    <span className="font-bold uppercase text-xs tracking-widest">Total XP</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{selectedChild.xp}</div>
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Clock size={20} fill="currentColor" />
                    <span className="font-bold uppercase text-xs tracking-widest">Study Time</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {selectedChild.sessions.reduce((acc, s) => acc + s.duration, 0)}m
                  </div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <FileText size={20} fill="currentColor" />
                    <span className="font-bold uppercase text-xs tracking-widest">Sessions</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{selectedChild.sessions.length}</div>
                </div>
              </div>

              {/* Session History */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart2 size={24} className="text-indigo-600" />
                  Recent Study Activity
                </h3>
                <div className="space-y-4">
                  {selectedChild.sessions.length > 0 ? (
                    selectedChild.sessions.slice(0, 5).map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-900">{session.subject}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            {new Date(session.timestamp).toLocaleDateString()} • {session.duration} mins
                          </p>
                        </div>
                        <div className="text-emerald-600 font-bold">+{session.xpEarned} XP</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No sessions recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Homework Recordings */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PlayCircle size={24} className="text-indigo-600" />
                  Voice Submissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedChild.recordings.length > 0 ? (
                     selectedChild.recordings.map(rec => (
                       <div key={rec.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                         <div className="bg-indigo-600 text-white p-3 rounded-xl cursor-pointer hover:bg-indigo-700">
                            <PlayCircle size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{rec.subject}</p>
                            <p className="text-xs text-slate-500 font-medium">{rec.date}</p>
                         </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-slate-400 col-span-2 text-center py-4">No homework recorded.</p>
                   )}
                </div>
              </div>
              
              <button 
                onClick={() => onSwitch(selectedChild.id)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Switch to {selectedChild.name}'s Profile
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[32px] border border-dashed border-slate-200">
               <Users size={64} className="text-slate-200 mb-4" />
               <p className="text-slate-400 font-medium">Select a profile to view analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
