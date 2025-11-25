import React, { useState } from 'react';
import { CLASS_ROSTER } from '../constants';
import { Sparkles, Search, Filter, MoreHorizontal, AlertCircle, BrainCircuit, TrendingUp, X, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import EdAssistAI from './EdAssistAI';
import { Student } from '../types';

const TeacherView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = CLASS_ROSTER.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Construct context for AI
  const rosterContext = JSON.stringify(filteredStudents.map(s => ({
    name: s.name,
    grade: s.grade,
    attendance: s.attendance,
    riskScore: s.riskScore,
    iep: s.iepStatus,
    goals: s.goals.map(g => g.title)
  })));

  const launchAi = (prompt?: string) => {
    setAiPrompt(prompt);
    setIsAiOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24 relative">
      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                        <p className="text-gray-400 text-sm">ID: {selectedStudent.id} • Grade {selectedStudent.grade}</p>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Attendance</div>
                            <div className="text-2xl font-bold text-blue-900">{selectedStudent.attendance}%</div>
                            <div className="text-[10px] text-gray-500">Last Year: 88%</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">GPA</div>
                            <div className="text-2xl font-bold text-green-900">{selectedStudent.gpa}</div>
                            <div className="text-[10px] text-gray-500">Last Year: 3.1</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Risk Score</div>
                            <div className="text-2xl font-bold text-orange-900">{selectedStudent.riskScore}</div>
                            <div className="text-[10px] text-gray-500">Last Year: 42</div>
                        </div>
                    </div>

                    {/* Longitudinal Data */}
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" /> Multi-Year Assessment Trends
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="p-3">Assessment</th>
                                    <th className="p-3">2023 (Prior)</th>
                                    <th className="p-3">2024 (Current)</th>
                                    <th className="p-3">Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-3 font-medium text-gray-900">NWEA Math</td>
                                    <td className="p-3 text-gray-500">225</td>
                                    <td className="p-3 font-bold text-gray-900">238</td>
                                    <td className="p-3 text-green-600 font-bold">+13</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-gray-900">NWEA Reading</td>
                                    <td className="p-3 text-gray-500">218</td>
                                    <td className="p-3 font-bold text-gray-900">222</td>
                                    <td className="p-3 text-yellow-600 font-bold">+4</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-gray-900">State Test (Algebra)</td>
                                    <td className="p-3 text-gray-500">Approaches</td>
                                    <td className="p-3 font-bold text-gray-900">Meets</td>
                                    <td className="p-3 text-green-600 font-bold"><ArrowRight size={16} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Interventions */}
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-purple-600" /> Active Interventions & Goals
                    </h3>
                    <div className="space-y-3">
                        {selectedStudent.goals.map((g, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-sm text-gray-800">{g.title}</div>
                                    <div className="text-xs text-gray-500">{g.type} • Due {g.dueDate}</div>
                                </div>
                                <span className="text-sm font-bold text-blue-600">{g.progress}%</span>
                            </div>
                        ))}
                        {selectedStudent.iepStatus && (
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center gap-2 text-sm text-purple-800">
                                <CheckCircle size={16} />
                                <span>Student has active 504 Plan accommodations.</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">Close</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">Start Conference Mode</button>
                </div>
            </div>
        </div>
      )}

      {/* EdAssist AI Modal */}
      <EdAssistAI 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        contextData={rosterContext}
        initialPrompt={aiPrompt}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Classroom Overview</h1>
            <p className="text-gray-500">Period 2: Algebra I</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition flex items-center gap-2">
                <Filter size={18} /> Filter
            </button>
            <button 
                onClick={() => launchAi()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition flex items-center gap-2 animate-pulse-slow"
            >
                <Sparkles size={18} /> Launch EdAssist AI
            </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search student name..." 
                className="bg-transparent outline-none flex-1 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {/* Roster Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="p-4 font-medium">Student Name</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Attendance</th>
                        <th className="p-4 font-medium">Current GPA</th>
                        <th className="p-4 font-medium">EWIS Risk Score</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => (
                        <tr 
                            key={student.id} 
                            onClick={() => setSelectedStudent(student)}
                            className="hover:bg-gray-50 transition border-b border-gray-50 last:border-0 cursor-pointer group"
                        >
                            <td className="p-4">
                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</div>
                                <div className="text-xs text-gray-400">ID: {student.id}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    {student.iepStatus && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">IEP/504</span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{student.attendance}%</td>
                            <td className="p-4 text-sm text-gray-600">{student.gpa}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                student.riskScore < 30 ? 'bg-green-500' : 
                                                student.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} 
                                            style={{width: `${student.riskScore}%`}}
                                        />
                                    </div>
                                    <span className={`text-xs font-bold ${
                                         student.riskScore < 30 ? 'text-green-600' : 
                                         student.riskScore < 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>{student.riskScore}</span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Quick Actions Grid - AI DEMO TRIGGERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Differentiation Use Case */}
        <div 
            onClick={() => launchAi("Based on the roster data, suggest 3 small groups for differentiation in tomorrow's math lesson. Consider risk scores and attendance.")}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                <BrainCircuit size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Group Students</h3>
            <p className="text-sm text-gray-500 mt-1">Use AI to create differentiation groups based on recent performance.</p>
        </div>

        {/* Connecting Data Points Use Case */}
        <div 
            onClick={() => launchAi("Analyze the correlation between attendance and risk scores for my students. Are there any students who need immediate intervention due to both factors?")}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-600 group-hover:text-white transition">
                <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Attendance vs. Achievement</h3>
            <p className="text-sm text-gray-500 mt-1">Identify students where attendance is impacting academic growth.</p>
        </div>

        {/* Intervention Use Case */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-3 group-hover:bg-red-600 group-hover:text-white transition">
                <AlertCircle size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Intervention Alerts</h3>
            <p className="text-sm text-gray-500 mt-1">3 students have missed 2+ days this week. View contact logs.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;