
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, AlertCircle, ShieldCheck, Camera, Bell } from 'lucide-react';
import { SUBJECTS } from '../constants';
import FaceScan from './FaceScan';

interface StudyTimerProps {
  onComplete: (subject: string, duration: number) => void;
  parentPin: string;
  referenceFace: string | null;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onComplete, parentPin, referenceFace }) => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  const handleStart = () => {
    if (minutes < 1) return;
    setSecondsLeft(minutes * 60);
    setIsActive(true);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsAlarming(true);
    // Silent persistent alert logic would go here
  };

  const verifyParent = () => {
    if (pinInput === parentPin) {
      setShowFaceScan(true);
      setError('');
    } else {
      setError('Incorrect Parent PIN');
    }
  };

  const handleVerificationSuccess = () => {
    setIsAlarming(false);
    setShowFaceScan(false);
    setPinInput('');
    onComplete(subject, minutes);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showFaceScan) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-500 animate-in fade-in zoom-in duration-300">
        <FaceScan onVerified={handleVerificationSuccess} referenceFace={referenceFace} />
      </div>
    );
  }

  if (isAlarming) {
    return (
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 shadow-2xl">
        <div className="bg-rose-600 p-6 rounded-full text-white animate-bounce shadow-lg shadow-rose-200">
          <Bell size={48} />
        </div>
        <h2 className="text-3xl font-black text-rose-900 uppercase">Study Period Ends</h2>
        <p className="text-rose-700 font-medium">Verification required to stop alarm and earn XP.</p>
        
        <div className="w-full max-w-xs space-y-4">
          <input 
            type="password" 
            placeholder="Parent PIN" 
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-3xl tracking-widest p-4 rounded-2xl border-2 border-rose-200 focus:border-rose-500 outline-none font-black"
          />
          {error && <p className="text-rose-600 font-bold">{error}</p>}
          <button 
            onClick={verifyParent}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            <ShieldCheck size={24} />
            Scan Parent Face
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select Subject</label>
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => !isActive && setSubject(s)}
                  className={`p-3 rounded-xl border-2 font-bold transition-all ${subject === s ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                  disabled={isActive}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Duration (Minutes)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="120" 
                value={minutes}
                onChange={(e) => !isActive && setMinutes(parseInt(e.target.value))}
                className="flex-1 h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                disabled={isActive}
              />
              <span className="text-2xl font-black text-indigo-600 w-16 text-center">{minutes}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-[40px] p-12 space-y-8 border border-indigo-100">
          <div className="text-center">
             <div className="text-7xl font-black text-indigo-900 tracking-tighter tabular-nums">
               {isActive ? formatTime(secondsLeft) : `${minutes}:00`}
             </div>
             <p className="mt-2 text-indigo-600 font-bold tracking-widest uppercase text-sm">Countdown</p>
          </div>

          <div className="flex gap-4">
            {!isActive ? (
              <button 
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 transition-all hover:scale-105"
              >
                <Play size={32} fill="currentColor" />
              </button>
            ) : (
              <button 
                onClick={() => setIsActive(false)}
                className="bg-amber-500 hover:bg-amber-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-amber-200 transition-all hover:scale-105"
              >
                <Pause size={32} fill="currentColor" />
              </button>
            )}
            
            <button 
              onClick={() => {
                setIsActive(false);
                setSecondsLeft(0);
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-600 w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
            >
              <Square size={24} fill="currentColor" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-indigo-500 font-medium text-sm">
            <AlertCircle size={16} />
            Timer is parent-protected
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
