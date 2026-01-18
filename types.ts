
export enum Level {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  DIAMOND = 'Diamond',
  RUBY = 'Ruby'
}

export interface VoiceRecording {
  id: string;
  subject: string;
  date: string;
  audioUrl: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  timestamp: number;
  xpEarned: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  standard: string;
  school: string;
  xp: number;
  level: Level;
  sessions: StudySession[];
  recordings: VoiceRecording[];
  certificates: string[]; // Level IDs achieved
}

export interface ParentConfig {
  pin: string;
  faceRegistered: boolean;
  faceData: string | null; // Base64 reference image
  onboardingComplete: boolean;
}

export interface AppState {
  children: ChildProfile[];
  activeChildId: string | null;
  parentConfig: ParentConfig;
}
