
import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, UserCheck, AlertCircle, XCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface FaceScanProps {
  onVerified: () => void;
  referenceFace: string | null;
}

const FaceScan: React.FC<FaceScanProps> = ({ onVerified, referenceFace }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<'initializing' | 'scanning' | 'analyzing' | 'success' | 'denied' | 'error'>('initializing');
  const [progress, setProgress] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } } 
        });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
          setStatus('scanning');
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setStatus('error');
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndVerify = async () => {
    if (!videoRef.current || !referenceFace) return;

    setStatus('analyzing');
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const currentFrame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    const refFrame = referenceFace.split(',')[1];

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure current key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Updated to the correct model alias for flash lite as per guidelines
        model: 'gemini-flash-lite-latest',
        contents: {
          parts: [
            { text: "Compare these two photos. Photo 1 is the registered parent ID. Photo 2 is the current person at the camera. Are they the same person?" },
            { inlineData: { mimeType: 'image/jpeg', data: refFrame } },
            { inlineData: { mimeType: 'image/jpeg', data: currentFrame } }
          ]
        },
        config: {
          // Use structured output for more reliable biometric verification results
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              match: {
                type: Type.BOOLEAN,
                description: "True if the persons in the images are likely the same",
              },
              confidence: {
                type: Type.NUMBER,
                description: "The confidence level of the comparison from 0 to 1",
              },
            },
            required: ["match", "confidence"],
          },
        },
      });

      // Directly access the .text property from the response
      const text = response.text || '{}';
      const result = JSON.parse(text);
      
      if (result.match === true && result.confidence > 0.6) {
        setStatus('success');
        setTimeout(() => {
          if (stream) stream.getTracks().forEach(t => t.stop());
          onVerified();
        }, 1500);
      } else {
        setStatus('denied');
        setTimeout(() => setStatus('scanning'), 3000); // Allow retry
      }
    } catch (err) {
      console.error("AI Verification Error", err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            captureAndVerify();
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative group">
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-indigo-600 rounded-tl-2xl z-10" />
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-indigo-600 rounded-tr-2xl z-10" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-indigo-600 rounded-bl-2xl z-10" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-indigo-600 rounded-br-2xl z-10" />

        <div className="relative w-72 h-72 rounded-[40px] overflow-hidden border-2 border-slate-200 bg-black shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover scale-x-[-1] transition-all duration-500 ${status === 'analyzing' ? 'opacity-40 blur-sm' : 'opacity-100'}`}
          />
          
          {status === 'scanning' && (
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_#818cf8] z-20"
                style={{ top: `${progress}%` }}
              />
              <div className="absolute inset-0 border-[30px] border-indigo-900/20 rounded-full scale-150 animate-pulse" />
            </div>
          )}

          {status === 'analyzing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/40 backdrop-blur-[2px] z-30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border-4 border-white/30 border-t-indigo-400 rounded-full animate-spin" />
                <span className="text-white font-black text-[10px] uppercase tracking-[0.3em] drop-shadow-md">Biometric Analysis</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center z-40 animate-in zoom-in">
              <ShieldCheck size={100} className="text-white drop-shadow-2xl" />
            </div>
          )}

          {status === 'denied' && (
            <div className="absolute inset-0 bg-rose-600/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-40 animate-in zoom-in">
              <XCircle size={80} className="text-white mb-4" />
              <p className="text-white font-black text-xl leading-tight uppercase">Access Denied</p>
              <p className="text-rose-100 text-xs mt-2 font-bold">Face does not match registered Parent ID</p>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-40">
              <AlertCircle size={48} className="text-rose-500 mb-2" />
              <p className="text-white font-bold text-sm">Hardware Link Error</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-3 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
          <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-indigo-500 animate-pulse' : status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            {status === 'scanning' ? 'Active Vision Feed' : 'Neural Processing'}
          </span>
        </div>
        
        <h3 className="text-3xl font-black text-slate-900">
          {status === 'scanning' && 'ID Scanning...'}
          {status === 'analyzing' && 'Authenticating'}
          {status === 'success' && 'Welcome Parent'}
          {status === 'denied' && 'Profile Mismatch'}
          {status === 'error' && 'Scan Fault'}
        </h3>
        
        <p className="text-slate-500 font-medium max-w-[280px] mx-auto text-sm leading-relaxed">
          {status === 'scanning' && 'Hold still. The AI is comparing your current face to the registered ID.'}
          {status === 'analyzing' && 'Running point-to-point geometric facial comparison...'}
          {status === 'success' && 'Verification successful. Control unlocked.'}
          {status === 'denied' && 'Parent identity not confirmed. Please try again or use PIN if configured.'}
        </p>
      </div>
    </div>
  );
};

export default FaceScan;
