
import React, { useState, useEffect } from 'react';
import { CLASS_ROSTER } from '../constants';
import { Sparkles, Search, Filter, AlertCircle, BrainCircuit, TrendingUp, X, BookOpen, Share, Save, Send, Mail, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EdAssistAI from './EdAssistAI';
import { Student } from '../types';
import { GoogleGenAI } from '@google/genai';

const TeacherView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Modal State
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'trends' | 'conference'>('overview');
  const [showPlpSuccess, setShowPlpSuccess] = useState(false);
  const [plpFormData, setPlpFormData] = useState({ goal: '', strategy: '', resources: '' });

  // Intervention State
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [interventionStudents, setInterventionStudents] = useState<Student[]>([]);

  // Auto-Summary State
  const [summaryText, setSummaryText] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [refineInput, setRefineInput] = useState('');

  // Filter students
  const filteredStudents = CLASS_ROSTER.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // At Risk Filter for Intervention
  useEffect(() => {
      setInterventionStudents(CLASS_ROSTER.filter(s => s.riskScore > 50 || s.attendance < 90));
  }, []);

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

  const handleStudentClick = (student: Student) => {
      setSelectedStudent(student);
      setActiveModalTab('overview'); // Reset to overview when opening
      setShowPlpSuccess(false);
      setSummaryText(''); // Clear previous summary
  };

  const handleCreatePLP = () => {
      setShowPlpSuccess(true);
      setTimeout(() => setShowPlpSuccess(false), 4000);
      setPlpFormData({ goal: '', strategy: '', resources: '' });
  };

  // Auto-Generate Summary on Tab Load
  useEffect(() => {
    if (activeModalTab === 'conference' && selectedStudent && !summaryText && !isGeneratingSummary) {
        generateActionableSummary();
    }
  }, [activeModalTab, selectedStudent]);

  const generateActionableSummary = async (customPrompt?: string) => {
      setIsGeneratingSummary(true);
      
      // Use real API if available, else mock for robustness
      let apiKey: string | undefined;
      try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env) apiKey = process.env.API_KEY;
      } catch (e) {}

      const basePrompt = `Summarize ${selectedStudent?.name}'s reading growth and recommend 3 actionable talking points for parents based on longitudinal data. Format with **bold** points.`;
      const promptToUse = customPrompt ? `Refine this summary: ${customPrompt}` : basePrompt;

      if (apiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: `Student Data: ${JSON.stringify(selectedStudent)}. ${promptToUse}` }] }]
            });
            setSummaryText(response.text || "Unable to generate summary.");
          } catch (e) {
              console.error(e);
              setSummaryText("Based on NWEA data, Leo has shown consistent growth in Math (+12 RIT) but stagnation in Reading. **Recommendation 1:** Discuss daily reading habits. **Recommendation 2:** Highlight his robotics success to build confidence. **Recommendation 3:** Review 504 accommodations for upcoming STAAR testing.");
          }
      } else {
          // Mock Fallback
          setTimeout(() => {
              setSummaryText("Based on longitudinal data, Leo has shown consistent growth in Math (+12 RIT) but stagnation in Reading. \n\n**1. Reading Fluency:** Leo is averaging 130 wpm, slightly below the goal of 150. Recommend 15 mins daily practice.\n**2. Math Strength:** Leverage his interest in robotics (Math RIT 230) to encourage reading technical manuals.\n**3. Attendance:** Recent 92% attendance is an improvement but still requires monitoring.");
          }, 1500);
      }
      setIsGeneratingSummary(false);
      setRefineInput('');
  };

  // Mock Longitudinal Data
  const longitudinalData = [
    { grade: '1st', math: 185, reading: 182, attendance: 98 },
    { grade: '2nd', math: 198, reading: 195, attendance: 97 },
    { grade: '3rd', math: 212, reading: 208, attendance: 96 },
    { grade: '4th', math: 205, reading: 210, attendance: 84 },
    { grade: '5th', math: 218, reading: 215, attendance: 91 },
    { grade: '6th', math: 228, reading: 222, attendance: 93 },
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-gray-50">
      
      {/* Intervention Alerts Modal */}
      {isInterventionOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <AlertCircle size={20} /> Intervention Required
                    </h3>
                    <button onClick={() => setIsInterventionOpen(false)} className="hover:bg-red-700 p-1 rounded transition"><X size={20} /></button>
                </div>
                <div className="p-6 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-4">The following students have triggered Early Warning Indicators (Attendance {'<'} 90% or Risk Score {'>'} 50) this week.</p>
                    <div className="space-y-3">
                        {interventionStudents.map(s => (
                            <div key={s.id} className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-900">{s.name}</h4>
                                    <div className="text-xs text-red-600 font-semibold mt-1">
                                        Risk Score: {s.riskScore} • Attendance: {s.attendance}%
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Email Parent"><Mail size={18}/></button>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Call Home"><Phone size={18}/></button>
                                    <button className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-200 hover:bg-red-100 transition">
                                        Log Contact
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                            {selectedStudent.iepStatus && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase">IEP/504</span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">ID: {selectedStudent.id} • Grade {selectedStudent.grade} • {selectedStudent.name.split(' ')[0]}'s Backpack</p>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
                </div>
                
                <div className="flex border-b border-gray-200 bg-gray-50 px-6">
                    {['overview', 'trends', 'conference'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveModalTab(tab as any)}
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors capitalize ${activeModalTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab === 'conference' ? 'Conference Prep' : tab === 'trends' ? 'Trends & Patterns' : tab}
                        </button>
                    ))}
                </div>
                
                <div className="p-6 overflow-y-auto bg-white flex-1">
                    {activeModalTab === 'overview' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Attendance</div>
                                    <div className="text-3xl font-bold text-blue-900">{selectedStudent.attendance}%</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                    <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">GPA</div>
                                    <div className="text-3xl font-bold text-green-900">{selectedStudent.gpa}</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                                    <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Risk Score</div>
                                    <div className="text-3xl font-bold text-orange-900">{selectedStudent.riskScore}</div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-blue-600" /> Active Goals
                                </h3>
                                <div className="space-y-3">
                                    {selectedStudent.goals.map((g, i) => (
                                        <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-gray-800">{g.title}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{g.type} • Due {g.dueDate}</div>
                                            </div>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{width: `${g.progress}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModalTab === 'trends' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600"><BrainCircuit size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">Explainable AI Insight</h4>
                                    <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                                        EdAssist AI analysis identifies a correlation: The <strong>dip in 4th Grade Math scores</strong> correlates with a <strong>15% drop in attendance</strong> during that same academic year.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={longitudinalData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="grade" />
                                        <YAxis domain={[150, 250]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="math" name="Math RIT" stroke="#3b82f6" strokeWidth={3} />
                                        <Line type="monotone" dataKey="reading" name="Reading RIT" stroke="#10b981" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeModalTab === 'conference' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                            <Sparkles size={18} /> Actionable Summary
                                        </h3>
                                        <p className="text-sm text-indigo-700 mt-1">Auto-generated by EdAssist based on longitudinal data.</p>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-5 border border-indigo-100 shadow-sm min-h-[120px] text-sm text-gray-800 leading-relaxed">
                                    {isGeneratingSummary ? (
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <span className="animate-spin">✨</span> Analyzing data patterns...
                                        </div>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}></div>
                                    )}
                                </div>

                                {/* Refinement Chat */}
                                <div className="mt-4 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={refineInput}
                                        onChange={(e) => setRefineInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && generateActionableSummary(refineInput)}
                                        placeholder="Refine this summary (e.g., 'Translate to Spanish', 'Make it simpler')..."
                                        className="flex-1 border border-indigo-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button 
                                        onClick={() => generateActionableSummary(refineInput)}
                                        disabled={isGeneratingSummary}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Share size={18} className="text-blue-600" /> Post-Conference Action</h3>
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700">New Intervention Goal</label>
                                        <input 
                                            type="text" 
                                            value={plpFormData.goal}
                                            onChange={(e) => setPlpFormData({...plpFormData, goal: e.target.value})}
                                            placeholder="e.g. Increase Reading Fluency to 140wpm" 
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-700">Instructional Strategy</label>
                                            <select 
                                                value={plpFormData.strategy}
                                                onChange={(e) => setPlpFormData({...plpFormData, strategy: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                                            >
                                                <option value="">Select Strategy...</option>
                                                <option value="Small Group">Small Group Instruction</option>
                                                <option value="Peer Tutoring">Peer Tutoring</option>
                                                <option value="Visual Aids">Visual Aids</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-700">Resources</label>
                                            <input 
                                                type="text" 
                                                value={plpFormData.resources}
                                                onChange={(e) => setPlpFormData({...plpFormData, resources: e.target.value})}
                                                placeholder="Assigned materials..." 
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button onClick={handleCreatePLP} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2">
                                            <Save size={16} /> Save & Assign
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showPlpSuccess && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-in z-[60]">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="font-medium">PLP Created & Resources Assigned!</span>
                </div>
            )}
        </div>
      )}

      {/* EdAssist AI Sidebar */}
      <EdAssistAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} contextData={rosterContext} initialPrompt={aiPrompt} role="Teacher" />

      <div className={`transition-all duration-300 ease-in-out ${isAiOpen ? 'mr-0 md:mr-[450px]' : ''}`}>
        <div className="p-6 max-w-7xl mx-auto pb-24">
            {/* Top Branding & Navigation Row - Added per instructions */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm text-xl text-white">
                        🦁
                    </div>
                    <span className="font-bold text-blue-900 text-lg bg-white px-4 py-1.5 rounded-full shadow-sm border border-blue-100">Rouse High School</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-gray-900">Classroom Overview</h1>
                    </div>
                    <p className="text-gray-500">Period 2: Algebra I</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => launchAi()} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition hover:brightness-110">
                        <Sparkles size={18} /> Launch EdAssist AI
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <Search className="text-gray-400" size={20} />
                    <input type="text" placeholder="Search student..." className="bg-transparent outline-none flex-1 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="text-xs text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Risk Score</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(s => (
                            <tr key={s.id} onClick={() => handleStudentClick(s)} className="hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0">
                                <td className="p-4 font-medium">{s.name}</td>
                                <td className="p-4">{s.iepStatus && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">IEP</span>}</td>
                                <td className="p-4"><div className={`text-xs font-bold ${s.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>{s.riskScore}</div></td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <ArrowRight size={16} className="text-gray-400"/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => launchAi("Group these students for math intervention based on risk scores.")} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3"><BrainCircuit size={20}/></div>
                    <h3 className="font-bold text-gray-800">Group Students</h3>
                    <p className="text-xs text-gray-500 mt-1">AI-generated differentiation groups.</p>
                </div>
                
                {/* Analyze Trends Tile - Restored */}
                <div onClick={() => launchAi("Analyze the correlation between attendance and math performance for this class.")} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3"><TrendingUp size={20}/></div>
                    <h3 className="font-bold text-gray-800">Analyze Trends</h3>
                    <p className="text-xs text-gray-500 mt-1">Ask AI to find correlations.</p>
                </div>

                <div onClick={() => setIsInterventionOpen(true)} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-3"><AlertCircle size={20}/></div>
                    <h3 className="font-bold text-gray-800">Intervention Alerts</h3>
                    <p className="text-xs text-gray-500 mt-1">{interventionStudents.length} students need attention.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
