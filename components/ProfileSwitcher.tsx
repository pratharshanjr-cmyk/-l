
import React, { useState } from 'react';
import { UserCircle, PlusCircle, ShieldCheck, ChevronDown, Camera, XCircle } from 'lucide-react';
import { ChildProfile } from '../types';
import FaceScan from './FaceScan';

interface ProfileSwitcherProps {
  children: ChildProfile[];
  activeId: string | null;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  parentPin: string;
  referenceFace: string | null;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ children, activeId, onSwitch, onAdd, parentPin, referenceFace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const activeChild = children.find(c => c.id === activeId);

  const handleSwitchRequest = (id: string) => {
    setPendingId(id);
    setShowPin(true);
    setIsOpen(false);
  };

  const handlePinVerify = () => {
    if (pin === parentPin && pendingId) {
      setShowPin(false);
      setShowFaceScan(true);
      setPin('');
      setError('');
    } else {
      setError('Wrong PIN');
    }
  };

  const handleFaceVerify = () => {
    if (pendingId) {
      onSwitch(pendingId);
      setShowFaceScan(false);
      setPendingId(null);
    }
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
          {activeChild ? activeChild.name[0] : <UserCircle />}
        </div>
        <div className="hidden lg:block flex-1 text-left overflow-hidden">
          <p className="text-sm font-black text-slate-900 truncate">{activeChild?.name || 'Switch Profile'}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeChild?.level || 'Parent'}</p>
        </div>
        <ChevronDown size={16} className={`hidden lg:block transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-4 left-0 right-0 bg-white border border-slate-100 rounded-3xl shadow-2xl p-2 z-[60] animate-in slide-in-from-bottom-2">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => handleSwitchRequest(child.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all ${child.id === activeId ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-xs">
                {child.name[0]}
              </div>
              <span className="font-bold text-sm">{child.name}</span>
            </button>
          ))}
          <div className="h-px bg-slate-100 my-2" />
          <button 
            onClick={onAdd}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-indigo-600 hover:bg-indigo-50 font-bold text-sm transition-all"
          >
            <PlusCircle size={20} />
            Add Child
          </button>
        </div>
      )}

      {showPin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Parent Access</h3>
              <p className="text-slate-500 font-medium text-sm mt-1">Confirm PIN to initiate biometric scan</p>
            </div>
            <div className="space-y-4">
              <input 
                type="password" 
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-3xl p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-black"
              />
              {error && <p className="text-rose-500 font-bold text-sm">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => setShowPin(false)}
                   className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handlePinVerify}
                   className="bg-indigo-600 text-white py-4 rounded-2xl font-bold"
                 >
                   Next
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFaceScan && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
             {/* Fix: Added missing XCircle icon */}
             <button onClick={() => setShowFaceScan(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
               <XCircle size={24} />
             </button>
             <FaceScan onVerified={handleFaceVerify} referenceFace={referenceFace} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;
