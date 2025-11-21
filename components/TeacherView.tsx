import React, { useState } from 'react';
import { CLASS_ROSTER } from '../constants';
import { Sparkles, Search, Filter, MoreHorizontal, AlertCircle, BrainCircuit, TrendingUp } from 'lucide-react';
import EdAssistAI from './EdAssistAI';

const TeacherView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="p-6 max-w-7xl mx-auto pb-24">
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
                        <tr key={student.id} className="hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                            <td className="p-4">
                                <div className="font-medium text-gray-900">{student.name}</div>
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
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
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