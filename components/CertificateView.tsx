
import React from 'react';
import { Download, Award, ShieldCheck } from 'lucide-react';
import { ChildProfile, Level } from '../types';

interface CertificateViewProps {
  child: ChildProfile;
  level: Level;
}

const CertificateView: React.FC<CertificateViewProps> = ({ child, level }) => {
  const [showFull, setShowFull] = React.useState(false);

  const date = new Date().toLocaleDateString();

  return (
    <>
      <button 
        onClick={() => setShowFull(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
      >
        <Award size={18} />
        View Certificate
      </button>

      {showFull && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] max-w-2xl w-full p-1 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Inner Border Design */}
            <div className="border-[12px] border-indigo-600 rounded-[39px] p-12 bg-white flex flex-col items-center text-center relative overflow-hidden">
               {/* Decorative Background Elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 opacity-50" />
               
               <Award size={80} className="text-indigo-600 mb-8 relative" />
               
               <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Certificate of Achievement</h1>
               <p className="text-slate-500 font-bold uppercase tracking-[0.2em] mb-12">Proudly Awarded To</p>
               
               <div className="w-full border-b-2 border-slate-200 mb-4" />
               <h2 className="text-5xl font-extrabold text-indigo-900 italic mb-4">{child.name}</h2>
               <div className="w-full border-b-2 border-slate-200 mb-12" />
               
               <p className="text-lg text-slate-700 leading-relaxed mb-12 max-w-md">
                 For outstanding discipline, dedication, and consistency in their studies, 
                 reaching the prestigious <span className="font-black text-indigo-600 uppercase">{level} RANK</span>.
               </p>
               
               <div className="flex justify-between w-full mt-12">
                 <div className="text-left">
                   <p className="font-bold text-slate-900">{child.standard}</p>
                   <p className="text-xs text-slate-400 font-bold uppercase">{child.school}</p>
                 </div>
                 <div className="text-center">
                    <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase shadow-sm">
                      <ShieldCheck size={20} />
                      Parent Approved
                    </div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-slate-900">{date}</p>
                   <p className="text-xs text-slate-400 font-bold uppercase">Award Date</p>
                 </div>
               </div>

               <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => window.print()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                  >
                    <Download size={20} />
                    Download PNG
                  </button>
                  <button 
                    onClick={() => setShowFull(false)}
                    className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold"
                  >
                    Close
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateView;
