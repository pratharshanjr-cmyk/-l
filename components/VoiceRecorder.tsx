import React, { useState, useRef } from 'react';
import { Mic, Square, Save, Trash2, Play, Pause, FileAudio } from 'lucide-react';
import { SUBJECTS } from '../constants';

interface VoiceRecorderProps {
  onSave: (recording: any) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  // Fixed: Use any for browser timer reference to avoid NodeJS namespace errors
  const timerInterval = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
        setRecordedUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      // Fixed: Prefix with window to ensure browser-compatible timer and avoid NodeJS type conflicts
      timerInterval.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    if (timerInterval.current) clearInterval(timerInterval.current);
  };

  const handleSave = () => {
    if (!recordedUrl) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      subject,
      date: new Date().toLocaleDateString(),
      audioUrl: recordedUrl
    });
    setRecordedUrl(null);
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
           <h2 className="text-2xl font-black text-slate-900">Homework Recorder</h2>
           <p className="text-slate-500 font-medium">Explain what you learned today verbally</p>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select Subject</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-700 appearance-none"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-indigo-50 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 border border-indigo-100 min-h-[250px] relative overflow-hidden">
          {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
               <div className="w-full h-full bg-rose-500 animate-pulse" />
            </div>
          )}

          <div className="text-4xl font-black text-indigo-900 tabular-nums">
            {formatDuration(duration)}
          </div>

          {!recordedUrl ? (
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 ${isRecording ? 'bg-rose-600 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-200'}`}
            >
              {isRecording ? <Square size={40} className="text-white fill-white" /> : <Mic size={40} className="text-white" />}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
               <div className="flex gap-4">
                 <button className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                    <Play size={24} className="ml-1" fill="currentColor" />
                 </button>
                 <button 
                  onClick={() => setRecordedUrl(null)}
                  className="w-16 h-16 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center"
                 >
                    <Trash2 size={24} />
                 </button>
               </div>
               
               <button 
                onClick={handleSave}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl"
               >
                 <Save size={20} />
                 Save Homework Recording
               </button>
            </div>
          )}

          <p className="text-indigo-500 font-bold text-xs uppercase tracking-widest">
            {isRecording ? 'Recording Explanation...' : recordedUrl ? 'Ready to Submit' : 'Tap to start recording'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;