
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Settings, 
  Trophy, 
  Clock, 
  LayoutDashboard, 
  Info,
  ShieldCheck,
  PlusCircle,
  UserCircle
} from 'lucide-react';
import { AppState, ChildProfile, ParentConfig, Level } from './types';
import { getLevelFromXP } from './constants';
import StudentView from './components/StudentView';
import ParentDashboard from './components/ParentDashboard';
import Onboarding from './components/Onboarding';
import About from './components/About';
import ProfileSwitcher from './components/ProfileSwitcher';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('eudguide_state');
    if (saved) return JSON.parse(saved);
    return {
      children: [],
      activeChildId: null,
      parentConfig: {
        pin: '',
        faceRegistered: false,
        faceData: null,
        onboardingComplete: false
      }
    };
  });

  const [view, setView] = useState<'student' | 'parent' | 'about' | 'onboarding'>('onboarding');

  useEffect(() => {
    localStorage.setItem('eudguide_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.parentConfig.onboardingComplete) {
      setView('onboarding');
    } else if (state.activeChildId) {
      setView('student');
    } else {
      setView('parent');
    }
  }, [state.parentConfig.onboardingComplete, state.activeChildId]);

  const handleAddChild = (child: Omit<ChildProfile, 'id' | 'xp' | 'level' | 'sessions' | 'recordings' | 'certificates'>) => {
    const newChild: ChildProfile = {
      ...child,
      id: Math.random().toString(36).substr(2, 9),
      xp: 0,
      level: Level.BRONZE,
      sessions: [],
      recordings: [],
      certificates: []
    };
    setState(prev => ({
      ...prev,
      children: [...prev.children, newChild].slice(0, 5),
      activeChildId: prev.activeChildId || newChild.id
    }));
  };

  const handleCompleteOnboarding = (pin: string, faceData: string) => {
    setState(prev => ({
      ...prev,
      parentConfig: {
        ...prev.parentConfig,
        pin,
        faceData,
        faceRegistered: true,
        onboardingComplete: true
      }
    }));
  };

  const switchChild = (id: string) => {
    setState(prev => ({ ...prev, activeChildId: id }));
    setView('student');
  };

  const activeChild = state.children.find(c => c.id === state.activeChildId);

  const updateChildXP = useCallback((childId: string, xpEarned: number, session: any) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c => {
        if (c.id === childId) {
          const newXP = c.xp + xpEarned;
          const newLevel = getLevelFromXP(newXP);
          const newCertificates = [...c.certificates];
          if (newLevel !== c.level && !newCertificates.includes(newLevel)) {
            newCertificates.push(newLevel);
          }
          return {
            ...c,
            xp: newXP,
            level: newLevel,
            sessions: [session, ...c.sessions],
            certificates: newCertificates
          };
        }
        return c;
      })
    }));
  }, []);

  const addVoiceRecording = (childId: string, recording: any) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            recordings: [recording, ...c.recordings]
          };
        }
        return c;
      })
    }));
  };

  if (!state.parentConfig.onboardingComplete) {
    return <Onboarding onComplete={handleCompleteOnboarding} onAddChild={handleAddChild} childrenCount={state.children.length} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar / Nav */}
      <nav className="w-full md:w-20 lg:w-64 bg-white border-r border-slate-200 flex md:flex-col justify-between order-2 md:order-1 p-4 shadow-lg md:shadow-none z-50">
        <div className="hidden md:flex flex-col gap-6 mb-8 items-center lg:items-start px-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="hidden lg:block font-extrabold text-xl tracking-tight text-indigo-900">EUDGUIDE</span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-4 flex-1 justify-center md:justify-start items-center lg:items-stretch">
          <button 
            onClick={() => setView('student')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'student' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Clock size={24} />
            <span className="hidden lg:block font-semibold">Study Timer</span>
          </button>
          <button 
            onClick={() => setView('parent')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={24} />
            <span className="hidden lg:block font-semibold">Parent Panel</span>
          </button>
          <button 
            onClick={() => setView('about')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'about' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Info size={24} />
            <span className="hidden lg:block font-semibold">About App</span>
          </button>
        </div>

        <div className="hidden md:flex flex-col gap-4 items-center lg:items-stretch">
          <ProfileSwitcher 
            children={state.children} 
            activeId={state.activeChildId} 
            onSwitch={switchChild} 
            onAdd={() => setView('onboarding')} 
            parentPin={state.parentConfig.pin}
            referenceFace={state.parentConfig.faceData}
          />
        </div>
      </nav>

      <main className="flex-1 order-1 md:order-2 overflow-y-auto bg-slate-50 relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {view === 'student' && activeChild && (
            <StudentView 
              child={activeChild} 
              onXPUpdate={(xp, session) => updateChildXP(activeChild.id, xp, session)}
              onRecordingAdd={(rec) => addVoiceRecording(activeChild.id, rec)}
              parentPin={state.parentConfig.pin}
              referenceFace={state.parentConfig.faceData}
            />
          )}
          {view === 'parent' && (
            <ParentDashboard 
              children={state.children} 
              onSwitch={switchChild} 
              parentPin={state.parentConfig.pin}
            />
          )}
          {view === 'about' && <About />}
          {view === 'onboarding' && (
             <Onboarding 
                onComplete={handleCompleteOnboarding} 
                onAddChild={handleAddChild} 
                childrenCount={state.children.length} 
                existingPin={state.parentConfig.pin}
                onFinish={() => setView('parent')}
              />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
