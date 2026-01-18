
import { Level } from './types';

export const XP_PER_SESSION = 30;

export const LEVEL_THRESHOLDS = [
  { level: Level.BRONZE, min: 0, max: 999, color: 'bg-amber-700' },
  { level: Level.SILVER, min: 1000, max: 1999, color: 'bg-slate-400' },
  { level: Level.GOLD, min: 2000, max: 2999, color: 'bg-yellow-400' },
  { level: Level.DIAMOND, min: 3000, max: 3999, color: 'bg-cyan-400' },
  { level: Level.RUBY, min: 4000, max: Infinity, color: 'bg-rose-600' }
];

export const getLevelFromXP = (xp: number): Level => {
  if (xp < 1000) return Level.BRONZE;
  if (xp < 2000) return Level.SILVER;
  if (xp < 3000) return Level.GOLD;
  if (xp < 4000) return Level.DIAMOND;
  return Level.RUBY;
};

export const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Coding', 'Music'
];
