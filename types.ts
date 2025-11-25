export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  PRINCIPAL = 'PRINCIPAL',
  ADMIN = 'ADMIN',
  BOARD = 'BOARD'
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  type: 'Academic' | 'Personal' | 'IEP/504' | 'College/Career';
  dueDate: string;
  status?: 'In Progress' | 'Completed';
}

export interface Artifact {
  id: string;
  title: string;
  type: 'image' | 'document' | 'video';
  url: string;
  date: string;
  tags: string[];
  linkedGoalId?: string;
}

export interface RiskHistoryPoint {
  period: string; // "2022", "2023" or "Aug", "Sep"
  score: number;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  gpa: number;
  attendance: number; // percentage
  riskScore: number; // EWIS Score (0-100)
  goals: Goal[];
  historicGoals: Goal[];
  artifacts: Artifact[];
  iepStatus?: boolean;
  riskHistory: {
    monthly: RiskHistoryPoint[];
    yearly: RiskHistoryPoint[];
  };
}

export interface AnalyticData {
  name: string;
  finance: number; // Munis data
  performance: number; // NWEA/Eduphoria data
  attendance: number;
}