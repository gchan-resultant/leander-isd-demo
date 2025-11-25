
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';
import { Search, Filter, Download, Users, TrendingUp, AlertCircle, BookOpen, GraduationCap, Calendar, ArrowRight, ChevronDown, X, Sparkles, Send, Mail, Phone } from 'lucide-react';
import EdAssistAI from './EdAssistAI';
import { GoogleGenAI } from '@google/genai';

// Mock Data for Scatter Plot (Achievement vs Growth)
const STUDENT_PERFORMANCE_DATA = [
  { name: 'Leo A.', achievement: 78, growth: 45, id: 'S001' }, // High Ach, Low Growth (Target)
  { name: 'Sarah M.', achievement: 92, growth: 88, id: 'S002' }, // High Ach, High Growth
  { name: 'James C.', achievement: 45, growth: 30, id: 'S003' }, // Low Ach, Low Growth
  { name: 'Maria R.', achievement: 65, growth: 72, id: 'S004' }, // Mid Ach, High Growth
  { name: 'David K.', achievement: 85, growth: 35, id: 'S005' }, // High Ach, Low Growth (Target)
  { name: 'Emily W.', achievement: 88, growth: 42, id: 'S006' }, // High Ach, Low Growth (Target)
  { name: 'Chris P.', achievement: 55, growth: 60, id: 'S007' },
  { name: 'Jessica T.', achievement: 95, growth: 90, id: 'S008' },
  { name: 'Michael B.', achievement: 72, growth: 25, id: 'S009' }, // Target
  { name: 'Ashley H.', achievement: 60, growth: 55, id: 'S010' },
  { name: 'Brian S.', achievement: 82, growth: 38, id: 'S011' }, // Target
  { name: 'Kevin L.', achievement: 40, growth: 20, id: 'S012' },
  { name: 'Amanda D.', achievement: 90, growth: 85, id: 'S013' },
  { name: 'Eric F.', achievement: 76, growth: 40, id: 'S014' }, // Target
  { name: 'Olivia G.', achievement: 58, growth: 65, id: 'S015' },
];

// Mock Data for Teacher Pulse
const TEACHER_PULSE_DATA = [
    { id: 't1', name: 'Mrs. Davis', dept: 'English', students: 145, failureRate: 4.2, attendance: 96 },
    { id: 't2', name: 'Mr. Thompson', dept: 'Math', students: 132, failureRate: 12.5, attendance: 92 },
    { id: 't3', name: 'Ms. Garcia', dept: 'Science', students: 150, failureRate: 8.1, attendance: 94 },
    { id: 't4', name: 'Mr. Roberts', dept: 'History', students: 140, failureRate: 3.5, attendance: 95 },
    { id: 't5', name: 'Mrs. Wilson', dept: 'Art', students: 125, failureRate: 0.8, attendance: 98 },
];

interface Teacher {
    id: string;
    name: string;
    dept: string;
    students: number;
    failureRate: number;
    attendance: number;
}

const CampusView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Context Data
  const campusContext = `
    Campus: Rouse High School.
    Enrollment: 2,450.
    Avg Attendance: 94.2%.
    Teacher Data: ${JSON.stringify(TEACHER_PULSE_DATA)}.
    Student Performance: ${JSON.stringify(STUDENT_PERFORMANCE_DATA)}.
    Goal: Identify high achievement/low growth students and support teachers with high failure rates.
  `;

  const handleTeacherClick = (teacher: Teacher) => {
      setSelectedTeacher(teacher);
      setAiSummary('');
      // Simulate AI Generation
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          if (teacher.failureRate > 10) {
              setAiSummary(`**Analysis:** ${teacher.name}'s failure rate of ${teacher.failureRate}% is significantly above the department average. 
              \n\n**Root Cause:** Correlation with low attendance (92%) in 2nd period Algebra I section.
              \n\n**Recommended Action:** 
              \n1. Schedule observation focusing on student engagement during direct instruction.
              \n2. Assign a peer mentor from the Math department (Ms. Garcia).`);
          } else {
              setAiSummary(`**Analysis:** ${teacher.name} is maintaining excellent performance metrics. 
              \n\n**Strength:** High attendance (${teacher.attendance}%) indicates strong classroom culture.
              \n\n**Recommended Action:** 
              \n1. Encourage ${teacher.name} to lead the next PLC on student engagement strategies.
              \n2. Nominate for District Excellence Award.`);
          }
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-x-hidden">
      
      {/* EdAssist AI Sidebar */}
      <EdAssistAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} contextData={campusContext} />

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{selectedTeacher.name}</h2>
                        <p className="text-gray-400 text-sm">{selectedTeacher.dept} Department • {selectedTeacher.students} Students</p>
                    </div>
                    <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-xs text-gray-500 font-bold uppercase">Failure Rate</div>
                            <div className={`text-2xl font-bold ${selectedTeacher.failureRate > 10 ? 'text-red-600' : 'text-green-600'}`}>{selectedTeacher.failureRate}%</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-xs text-gray-500 font-bold uppercase">Attendance</div>
                            <div className="text-2xl font-bold text-blue-600">{selectedTeacher.attendance}%</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-xs text-gray-500 font-bold uppercase">Observation Score</div>
                            <div className="text-2xl font-bold text-gray-800">3.8<span className="text-sm text-gray-400">/4.0</span></div>
                        </div>
                    </div>

                    {/* AI Summary Section */}
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <Sparkles size={18} /> Instructional Impact Summary
                        </h3>
                        <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm text-sm text-gray-700 leading-relaxed min-h-[100px]">
                            {isGenerating ? (
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <span className="animate-spin">✨</span> Analyzing classroom data...
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                            <button className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-50 flex items-center gap-1">
                                <Mail size={12} /> Email Summary
                            </button>
                            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 flex items-center gap-1">
                                <Calendar size={12} /> Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className={`transition-all duration-300 ease-in-out ${isAiOpen ? 'mr-0 md:mr-[450px]' : ''}`}>
        {/* White Header (Matching Teacher View) */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <GraduationCap size={24} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-gray-900 leading-none">Campus Insights</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Rouse High School</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current View</div>
                    <div className="text-sm font-bold text-gray-700">Principal / Campus Leader</div>
                </div>
                <button onClick={() => setIsAiOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition hover:shadow-lg hover:brightness-110">
                    <Sparkles size={18} /> Launch EdAssist AI
                </button>
            </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-10 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-10"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="text-3xl font-bold mb-2">Student Growth Overview</h2>
                <p className="text-blue-100 max-w-2xl text-lg">
                    Identifying cohorts demonstrating high achievement but low growth potential for targeted instructional intervention.
                </p>
                <div className="mt-6 flex gap-3">
                    <button className="bg-white text-blue-700 px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-blue-50 transition flex items-center gap-2">
                        <TrendingUp size={16} /> View Growth Report
                    </button>
                    <button className="bg-blue-700/50 text-white border border-blue-400 px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-700/70 transition flex items-center gap-2">
                        <Filter size={16} /> Filter Cohorts
                    </button>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8 -mt-8 relative z-10 pb-12">
            
            {/* Stats Grid (EdData Style) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Enrollment', value: '2,450', icon: Users, color: 'blue' },
                    { label: 'Avg Daily Attendance', value: '94.2%', icon: Calendar, color: 'green' },
                    { label: 'At-Risk Students', value: '342', icon: AlertCircle, color: 'orange' },
                    { label: 'College Ready (CCMR)', value: '78%', icon: BookOpen, color: 'purple' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1 group-hover:text-blue-600 transition">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: The Quadrant Chart (2/3 Width) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Student Achievement vs. Growth</h3>
                            <p className="text-sm text-gray-500">Math - Grade 10 (NWEA MAP)</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                            <Download size={16} /> Export
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="h-96 w-full relative">
                            {/* Quadrant Labels */}
                            <div className="absolute top-2 right-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 z-10">High Achievement / High Growth</div>
                            <div className="absolute bottom-2 left-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 z-10">Low Achievement / Low Growth</div>
                            <div className="absolute top-2 left-2 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-100 z-10">Low Achievement / High Growth</div>
                            <div className="absolute bottom-2 right-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 z-10 shadow-sm animate-pulse border-2 border-blue-200">
                                Target: High Achievement / Low Growth
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="achievement" name="Achievement" unit="%" label={{ value: 'Achievement Score', position: 'bottom', offset: 0 }} domain={[0, 100]} />
                                    <YAxis type="number" dataKey="growth" name="Growth" unit="%" label={{ value: 'Growth Percentile', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
                                                    <p className="font-bold text-gray-900">{payload[0].payload.name}</p>
                                                    <p className="text-blue-600">Achievement: {payload[0].value}%</p>
                                                    <p className="text-green-600">Growth: {payload[1].value}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                    
                                    {/* Quadrant Lines */}
                                    <ReferenceLine x={70} stroke="gray" strokeDasharray="3 3" />
                                    <ReferenceLine y={50} stroke="gray" strokeDasharray="3 3" />

                                    <Scatter name="Students" data={STUDENT_PERFORMANCE_DATA} fill="#8884d8">
                                        {STUDENT_PERFORMANCE_DATA.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.achievement > 70 && entry.growth < 50 ? '#ef4444' : entry.achievement > 70 ? '#10b981' : '#94a3b8'} 
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-blue-600 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">Analysis Insight</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                    <strong>6 students</strong> are in the "High Achievement / Low Growth" quadrant (Red dots). These students are performing well but have stalled in progress. 
                                    <button className="ml-2 underline font-bold text-blue-700 hover:text-blue-900">View Student List</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Teacher Pulse */}
                <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">Teacher Pulse</h3>
                        <p className="text-sm text-gray-500">Instructional effectiveness metrics</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-semibold">
                                <tr>
                                    <th className="p-3 rounded-l-lg">Teacher</th>
                                    <th className="p-3 text-center">Fail %</th>
                                    <th className="p-3 rounded-r-lg text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {TEACHER_PULSE_DATA.map((teacher, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-gray-800 group-hover:text-blue-600">{teacher.name}</div>
                                            <div className="text-xs text-gray-400">{teacher.dept} • {teacher.students} Students</div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded-full font-bold text-xs ${teacher.failureRate > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {teacher.failureRate}%
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => handleTeacherClick(teacher)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-lg transition flex items-center justify-center gap-2">
                            View All Staff <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default CampusView;
