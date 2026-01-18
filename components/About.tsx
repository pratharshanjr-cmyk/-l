
import React from 'react';
import { Info, User, Zap, ShieldCheck, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">About EUDGUIDE</h1>
        <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">Guide your time. Grow your mind.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
          <div className="bg-indigo-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Zap size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">The Mission</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            EUDGUIDE is a smart study discipline app designed to solve real-world challenges faced by students and parents. 
            We combine high-stakes accountability (parent-locked alarms) with rewarding gamification (XP and levels) to transform 
            studying from a chore into a consistent, daily habit.
          </p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[40px] shadow-xl text-white space-y-6">
          <div className="bg-indigo-500 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-black">The Creator</h2>
          <div className="space-y-4">
             <p className="text-indigo-200 leading-relaxed text-lg">
               Created by <span className="text-white font-black">Pratharshan</span>, a 9th Standard student.
             </p>
             <p className="text-slate-400 text-md italic">
               "This app was built to solve the focus problems I and my friends faced every day. 
               By merging discipline with the thrill of leveling up, we make growth inevitable."
             </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-12 rounded-[40px] border border-indigo-100 text-center space-y-8">
         <h2 className="text-3xl font-black text-indigo-900">Core Disciplines</h2>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                 <ShieldCheck size={28} />
               </div>
               <h3 className="font-black text-indigo-900">Anti-Cheat</h3>
               <p className="text-sm text-indigo-700 font-medium">Verification required for all rewards.</p>
            </div>
            <div className="space-y-4">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                 <Heart size={28} />
               </div>
               <h3 className="font-black text-indigo-900">Family First</h3>
               <p className="text-sm text-indigo-700 font-medium">Up to 5 children on a single device.</p>
            </div>
            <div className="space-y-4">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                 <Zap size={28} />
               </div>
               <h3 className="font-black text-indigo-900">Gamified</h3>
               <p className="text-sm text-indigo-700 font-medium">Progress through 5 rank levels.</p>
            </div>
         </div>
      </div>
      
      <div className="text-center text-slate-400 font-bold py-12">
        &copy; 2024 EUDGUIDE • Build with Focus
      </div>
    </div>
  );
};

export default About;
