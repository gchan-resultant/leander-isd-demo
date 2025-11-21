import { Student, Goal, Artifact, AnalyticData } from './types';

export const MOCK_STUDENT: Student = {
  id: 'S12345',
  name: 'Leo Anderson',
  grade: 10,
  gpa: 3.4,
  attendance: 92,
  riskScore: 35, // Moderate risk
  iepStatus: true,
  goals: [
    {
      id: 'g1',
      title: 'Improve Math RIT Score',
      description: 'Increase NWEA MAP Math score from 230 to 245 by end of semester.',
      progress: 65,
      type: 'Academic',
      dueDate: '2025-12-15'
    },
    {
      id: 'g2',
      title: 'Reading Fluency',
      description: 'Accommodated reading goal per 504 plan: Read 150 wpm.',
      progress: 80,
      type: 'IEP/504',
      dueDate: '2025-11-30'
    }
  ],
  artifacts: [
    {
      id: 'a1',
      title: 'Robotics Project Diagram',
      type: 'image',
      url: 'https://picsum.photos/400/300',
      date: '2025-10-12',
      tags: ['STEM', 'Collaboration']
    },
    {
      id: 'a2',
      title: 'History Essay - Texas Revolution',
      type: 'document',
      url: 'https://picsum.photos/400/300?grayscale',
      date: '2025-09-20',
      tags: ['Writing', 'History']
    }
  ]
};

export const CLASS_ROSTER: Student[] = [
  MOCK_STUDENT,
  { ...MOCK_STUDENT, id: 'S12346', name: 'Sarah Miller', riskScore: 12, gpa: 3.9, attendance: 98, iepStatus: false },
  { ...MOCK_STUDENT, id: 'S12347', name: 'James Carter', riskScore: 78, gpa: 2.1, attendance: 82, iepStatus: false },
  { ...MOCK_STUDENT, id: 'S12348', name: 'Maria Rodriguez', riskScore: 45, gpa: 2.8, attendance: 89, iepStatus: true },
];

// Combined data for Analytics Use Case (Munis + Eduphoria/NWEA)
export const DISTRICT_ANALYTICS: AnalyticData[] = [
  { name: 'Rouse HS', finance: 12500, performance: 88, attendance: 95 },
  { name: 'Vandegrift HS', finance: 11800, performance: 92, attendance: 96 },
  { name: 'Leander HS', finance: 13200, performance: 85, attendance: 91 },
  { name: 'Cedar Park HS', finance: 12100, performance: 89, attendance: 94 },
  { name: 'Glenn HS', finance: 12900, performance: 82, attendance: 89 },
];

// Board Member View Data
export const BOARD_ASSESSMENT_TRENDS = [
  { period: 'Fall', year: '2024', district: 212, norm: 210, previous: 208 },
  { period: 'Winter', year: '2024', district: 219, norm: 216, previous: 214 },
  { period: 'Spring', year: '2025', district: 228, norm: 222, previous: 221 },
];

export const BOARD_GAP_ANALYSIS = [
  { group: 'All Students', current: 78, target: 80 },
  { group: 'Eco Dis', current: 65, target: 70 },
  { group: 'SPED', current: 48, target: 55 },
  { group: 'EB/EL', current: 54, target: 60 },
  { group: 'Gifted', current: 98, target: 95 },
];

// New Data for Data Studio Scenarios
export const SUB_IMPACT_DATA = [
  { category: 'Certified Teacher', avgGrowth: 12.5, attendance: 96, count: 850 },
  { category: 'Long-Term Sub (>6 weeks)', avgGrowth: 7.2, attendance: 91, count: 45 },
  { category: 'Short-Term Sub', avgGrowth: 4.8, attendance: 88, count: 20 },
];

export const PROGRAM_ROI_DATA = [
  { program: 'Reading Recovery', cost: 1200, growthPoints: 14, costPerPoint: 85 },
  { program: 'After-school Tutoring', cost: 400, growthPoints: 6, costPerPoint: 66 },
  { program: 'Online Math Intervention', cost: 150, growthPoints: 4, costPerPoint: 37 },
  { program: 'Summer Bridge', cost: 800, growthPoints: 8, costPerPoint: 100 },
];