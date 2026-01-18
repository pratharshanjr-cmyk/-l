
import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, ShieldCheck, CheckCircle2, ArrowRight, Camera, RefreshCw } from 'lucide-react';

interface OnboardingProps {
  onComplete: (pin: string, faceData: string) => void;
  onAddChild: (child: any) => void;
  childrenCount: number;
  existingPin?: string;
  onFinish?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onAddChild, childrenCount, existingPin, onFinish }) => {
  const [step, setStep] = useState(existingPin ? 2 : 1);
  const [pin, setPin] = useState('');
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [faceData, setFaceData] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRegistration = async () => {
    try {
      setIsRegistering(true);
      const activeStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } } 
      });
      setStream(activeStream);
      if (videoRef.current) {
        videoRef.current.srcObject = activeStream;
      }
    } catch (err) {
      alert("Camera access is needed to register parent biometrics.");
      setIsRegistering(false);
    }
  };

  const captureFace = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setFaceData(dataUrl);
    setIsRegistering(false);
    
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleFinishStep1 = () => {
    if (pin.length === 4 && faceData) {
      setStep(2);
    } else {
      alert("Please enter a 4-digit PIN and capture your face for biometric registration.");
    }
  };

  const handleAddChildProfile = () => {
    if (childName && grade && school) {
      onAddChild({ name: childName, standard: grade, school });
      setChildName('');
      setGrade('');
      setSchool('');
    }
  };

  const handleComplete = () => {
    if (childrenCount > 0 && faceData) {
      onComplete(pin || existingPin || '', faceData);
      if (onFinish) onFinish();
    } else {
      alert("Add at least one child profile to continue.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[1000] overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-12 md:py-20 space-y-12">
        <div className="text-center space-y-4">
           <div className="inline-block bg-indigo-600 text-white p-4 rounded-3xl shadow-xl shadow-indigo-100 mb-4">
              <ShieldCheck size={48} />
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">EUDGUIDE</h1>
           <p className="text-slate-500 text-xl font-medium">Guide your time. Grow your mind.</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center gap-4">
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
             <div className={`h-full bg-indigo-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        </div>

        {step === 1 && (
          <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Guardian Registration</h2>
              <p className="text-slate-500 font-medium">Create your secure biometric profile</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 1: Security PIN</label>
              <input 
                type="password" 
                maxLength={4} 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="0000"
                className="w-full text-center text-4xl p-6 rounded-3xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-black tracking-[0.5em]"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 2: Biometric Face Record</label>
              
              {!isRegistering && !faceData ? (
                <button 
                  onClick={startRegistration}
                  className="w-full p-8 rounded-3xl border-2 border-dashed border-indigo-200 bg-white text-indigo-600 flex flex-col items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                >
                  <Camera size={32} />
                  <span className="font-black">Open Biometric Camera</span>
                </button>
              ) : isRegistering ? (
                <div className="relative rounded-[40px] overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border-4 border-indigo-500 shadow-2xl">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 animate-pulse pointer-events-none" />
                  <button 
                    onClick={captureFace}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    CAPTURE MASTER ID
                  </button>
                </div>
              ) : (
                <div className="w-full p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-between">
                   <div className="flex items-center gap-4 text-emerald-700">
                      <div className="bg-emerald-500 text-white p-2 rounded-xl">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="font-black text-sm uppercase tracking-wider">Reference ID Saved</span>
                   </div>
                   <button onClick={() => { setFaceData(null); startRegistration(); }} className="text-emerald-600 hover:underline text-xs font-bold">
                     Replace ID
                   </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleFinishStep1}
              className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
            >
              Confirm Security Setup
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Family Members</h2>
                <p className="text-slate-500 font-medium">Add children who will use this device</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Student Name" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Grade / Class" 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 font-bold"
                />
                <input 
                  type="text" 
                  placeholder="School Name" 
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 font-bold"
                />
                <button 
                  onClick={handleAddChildProfile}
                  className="w-full bg-white text-indigo-600 border-2 border-indigo-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-sm"
                  disabled={childrenCount >= 5}
                >
                  <UserPlus size={20} />
                  {childrenCount >= 5 ? 'Family limit reached' : 'Register Student'}
                </button>
              </div>
            </div>

            <button 
              onClick={handleComplete}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${childrenCount > 0 ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              disabled={childrenCount === 0}
            >
              <CheckCircle2 size={24} />
              Ready to Study
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
