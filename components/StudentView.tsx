
import React, { useState } from 'react';
import { MOCK_STUDENT, ASSETS } from '../constants';
import { Target, Trophy, Upload, FileText, Image as ImageIcon, User, Star, BookOpen, Sun, Smile, Rocket, Video, Plus, Calendar, Tag, X, Check, Clock, CloudUpload, Link as LinkIcon } from 'lucide-react';
import { Student, Artifact, Goal } from '../types';

const StudentView: React.FC = () => {
  // Use state for student data to allow updates (adding artifacts)
  const [student, setStudent] = useState<Student>(MOCK_STUDENT);
  const [kidMode, setKidMode] = useState(false); // Toggle between Elementary/HS UI
  
  // Add Goal Modal State
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<{title: string; type: string; dueDate: string; description: string}>({
      title: '',
      type: 'Academic',
      dueDate: '',
      description: ''
  });
  
  // Add Artifact Modal State
  const [isAddArtifactOpen, setIsAddArtifactOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newArtifact, setNewArtifact] = useState<{title: string; linkedGoalId: string; type: 'image' | 'document' | 'video'}>({
      title: '',
      linkedGoalId: '',
      type: 'document'
  });

  const handleOpenArtifactModal = () => {
      setNewArtifact({ title: '', linkedGoalId: '', type: 'document' });
      setSelectedFile(null);
      setIsAddArtifactOpen(true);
  };

  const handleSimulateUpload = () => {
      // Simulate file selection
      const file = new File(["dummy content"], "math_unit_5_scan.jpg", { type: "image/jpeg" });
      setSelectedFile(file);
      
      // Auto-fill form for the demo flow
      const mathGoal = student.goals.find(g => g.title.toLowerCase().includes("math"));
      setNewArtifact(prev => ({
          ...prev,
          title: "Math Assessment - Unit 5",
          type: 'image',
          linkedGoalId: mathGoal ? mathGoal.id : prev.linkedGoalId
      }));
  };

  const handleSaveArtifact = () => {
      if (!newArtifact.title) return;
      setIsUploading(true);
      
      // Simulate network request and update state
      setTimeout(() => {
          const artifact: Artifact = {
              id: `new-${Date.now()}`,
              title: newArtifact.title,
              type: newArtifact.type,
              url: '#', // Mock URL
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              tags: ['New', 'Portfolio'],
              linkedGoalId: newArtifact.linkedGoalId || undefined
          };

          setStudent(prev => ({
              ...prev,
              artifacts: [artifact, ...prev.artifacts]
          }));

          setIsUploading(false);
          setIsAddArtifactOpen(false);
      }, 1500);
  };

  const handleSaveGoal = () => {
      if (!newGoal.title) return;

      const goal: Goal = {
          id: `new-goal-${Date.now()}`,
          title: newGoal.title,
          description: newGoal.description || 'New goal',
          progress: 0,
          type: newGoal.type as any,
          dueDate: newGoal.dueDate || new Date().toLocaleDateString('en-US'),
          status: 'In Progress'
      };

      setStudent(prev => ({
          ...prev,
          goals: [goal, ...prev.goals]
      }));

      // Reset and close
      setNewGoal({ title: '', type: 'Academic', dueDate: '', description: '' });
      setIsAddGoalOpen(false);
  };

  // ----------------------------------------------------------------------
  // ELEMENTARY MODE LAYOUT
  // ----------------------------------------------------------------------
  if (kidMode) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 bg-sky-50 min-h-screen font-sans">
        
        {/* Upload Modal (Shared) */}
        {isAddArtifactOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-blue-200">
                    <div className="bg-blue-400 p-5 flex justify-between items-center text-white">
                        <h3 className="font-bold text-2xl flex items-center gap-2"><CloudUpload size={28}/> Add Work</h3>
                        <button onClick={() => setIsAddArtifactOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition"><X size={24} /></button>
                    </div>
                    
                    <div className="p-6 space-y-5 bg-white">
                        <div 
                            onClick={handleSimulateUpload}
                            className={`border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition cursor-pointer ${selectedFile ? 'border-green-300 bg-green-50 text-green-600' : 'border-blue-100 text-blue-300 bg-blue-50 hover:bg-blue-100'}`}
                        >
                            {selectedFile ? (
                                <>
                                    <Check size={48} />
                                    <p className="font-bold text-lg mt-2 text-center break-all">{selectedFile.name}</p>
                                </>
                            ) : (
                                <>
                                    <CloudUpload size={48} />
                                    <p className="font-bold text-lg mt-2">Tap to Upload</p>
                                </>
                            )}
                        </div>
                        
                        <div>
                            <label className="block font-bold text-gray-600 mb-1 ml-1">What is this?</label>
                            <input 
                                type="text" 
                                value={newArtifact.title}
                                onChange={(e) => setNewArtifact({...newArtifact, title: e.target.value})}
                                placeholder="My Drawing..." 
                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg font-medium focus:border-blue-400 outline-none" 
                            />
                        </div>

                         <div>
                            <label className="block font-bold text-gray-600 mb-1 ml-1">For which mission?</label>
                            <select 
                                 value={newArtifact.linkedGoalId}
                                 onChange={(e) => setNewArtifact({...newArtifact, linkedGoalId: e.target.value})}
                                 className="w-full border-2 border-gray-200 bg-white rounded-xl p-3 text-lg font-medium outline-none"
                            >
                                <option value="">-- Just for fun --</option>
                                {student.goals.map(g => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={handleSaveArtifact}
                            disabled={!newArtifact.title || isUploading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg transform active:scale-95 transition flex items-center justify-center gap-2"
                        >
                            {isUploading ? 'Saving...' : <><Check size={24} /> Save It!</>}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Top Navigation / Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-blue-200 shadow-sm text-2xl">
                🦁
             </div>
             <span className="font-bold text-blue-800 text-lg bg-blue-100 px-4 py-1 rounded-full">Tarvin Elementary</span>
          </div>
          <button
            onClick={() => setKidMode(false)}
            className="bg-white border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-sm"
          >
            Switch to High School View
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                <Sun size={200} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border-4 border-white/30">
                    <Smile size={64} className="text-white" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Hi, {student.name.split(' ')[0]}!</h1>
                    <p className="text-blue-100 text-xl font-medium">Ready for a great day of learning?</p>
                </div>
                <div className="flex-1" />
                <div className="flex gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-md border border-white/20">
                        <div className="text-3xl font-bold">{student.attendance}%</div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-80">Attendance</div>
                    </div>
                    <div className="bg-yellow-400 text-yellow-900 rounded-2xl p-4 text-center shadow-md transform rotate-3 border-b-4 border-yellow-600">
                        <div className="text-3xl font-bold flex items-center justify-center gap-1">
                            12 <Star fill="currentColor" size={20}/>
                        </div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-80">Star Points</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Elementary Achievements Section */}
        <div className="mb-2">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                    <Trophy size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">My Badges</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
                <div className="bg-white p-4 rounded-3xl border-4 border-yellow-200 shadow-sm flex flex-col items-center min-w-[140px]">
                    <div className="text-4xl mb-2">📚</div>
                    <span className="font-black text-gray-700">Super Reader</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border-4 border-blue-200 shadow-sm flex flex-col items-center min-w-[140px]">
                    <div className="text-4xl mb-2">🧮</div>
                    <span className="font-black text-gray-700">Math Whiz</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border-4 border-green-200 shadow-sm flex flex-col items-center min-w-[140px]">
                    <div className="text-4xl mb-2">🤝</div>
                    <span className="font-black text-gray-700">Kind Friend</span>
                </div>
                <div className="bg-white/50 p-4 rounded-3xl border-4 border-dashed border-gray-300 shadow-none flex flex-col items-center min-w-[140px] opacity-70">
                    <div className="text-4xl mb-2 opacity-50">🎨</div>
                    <span className="font-black text-gray-400">Artist (Soon!)</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Missions (Goals) */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                        <Rocket size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">My Missions</h2>
                </div>

                <div className="space-y-4">
                    {student.goals.map((goal) => (
                        <div key={goal.id} className="bg-white rounded-3xl p-6 border-4 border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                    {goal.type === 'IEP/504' && (
                                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-black uppercase tracking-wide rounded-full mb-2">
                                            Special Goal
                                        </span>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{goal.title}</h3>
                                </div>
                                <div className="bg-gray-50 rounded-2xl px-4 py-2 font-black text-gray-400 text-xl">
                                    {goal.progress}%
                                </div>
                             </div>
                             
                             {/* Big Progress Bar */}
                             <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <div 
                                    className={`h-full rounded-full ${goal.type === 'Academic' ? 'bg-blue-400' : 'bg-purple-400'} transition-all duration-1000 ease-out relative`}
                                    style={{ width: `${goal.progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                             </div>
                             <p className="mt-3 text-gray-500 font-medium">{goal.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Backpack (Artifacts) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                            <BookOpen size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Backpack</h2>
                    </div>
                    <button 
                        onClick={handleOpenArtifactModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition"
                    >
                         <Upload size={24} />
                    </button>
                </div>

                {/* Updated Grid to grid-cols-3 for smaller tiles */}
                <div className="grid grid-cols-3 gap-3">
                    {student.artifacts.map((artifact) => (
                        <div key={artifact.id} className="bg-white p-2 pb-3 rounded-3xl border-b-4 border-r-4 border-gray-200 hover:border-blue-300 hover:translate-y-[-2px] transition cursor-pointer flex flex-col h-full">
                            <div className="aspect-square bg-indigo-50 rounded-2xl mb-2 flex items-center justify-center text-indigo-400 relative">
                                {artifact.type === 'video' ? <Video size={24} /> : <FileText size={24} />}
                            </div>
                            <h4 className="font-bold text-gray-700 leading-tight mb-1 text-xs line-clamp-2">{artifact.title}</h4>
                            <span className="text-[10px] text-gray-400 font-bold mt-auto">{artifact.date}</span>
                        </div>
                    ))}
                     
                     {/* Add New Placeholder */}
                     <button onClick={handleOpenArtifactModal} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition aspect-square">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-1">
                            <span className="text-xl font-bold">+</span>
                        </div>
                        <span className="font-bold text-[10px]">Add</span>
                     </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // HIGH SCHOOL MODE LAYOUT (Modern Glassmorphism)
  // ----------------------------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-32 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      
      {/* Add Artifact Modal */}
      {isAddArtifactOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100 border border-white/20">
                <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
                    <h3 className="font-bold text-xl flex items-center gap-2"><Upload size={20}/> Add to Backpack</h3>
                    <button onClick={() => setIsAddArtifactOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-5 bg-gray-50/50">
                    {/* File Drop Zone Simulation */}
                    <div 
                        onClick={handleSimulateUpload}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition cursor-pointer group ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-400'}`}
                    >
                        {selectedFile ? (
                             <>
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                    <Check size={32} />
                                </div>
                                <p className="text-sm font-bold text-green-700">{selectedFile.name}</p>
                                <p className="text-xs text-green-600 mt-1">Ready to upload</p>
                             </>
                        ) : (
                             <>
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <CloudUpload size={32} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, MP4 (Max 10MB)</p>
                             </>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Artifact Title</label>
                        <input 
                            type="text" 
                            value={newArtifact.title}
                            onChange={(e) => setNewArtifact({...newArtifact, title: e.target.value})}
                            placeholder="e.g. History Essay Final Draft" 
                            className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                            <select 
                                value={newArtifact.type}
                                onChange={(e) => setNewArtifact({...newArtifact, type: e.target.value as any})}
                                className="w-full border border-gray-200 bg-white rounded-xl p-3 outline-none shadow-sm"
                            >
                                <option value="document">Document</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                <LinkIcon size={14} /> Link to Goal
                            </label>
                            <select 
                                 value={newArtifact.linkedGoalId}
                                 onChange={(e) => setNewArtifact({...newArtifact, linkedGoalId: e.target.value})}
                                 className="w-full border border-gray-200 bg-white rounded-xl p-3 outline-none shadow-sm"
                            >
                                <option value="">-- No Goal --</option>
                                {student.goals.map(g => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        <button 
                            onClick={handleSaveArtifact}
                            disabled={!newArtifact.title || isUploading}
                            className={`w-full py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 ${!newArtifact.title || isUploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98]'}`}
                        >
                            {isUploading ? (
                                <>
                                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Check size={18} /> Save to Backpack
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 border border-white/20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center text-white">
                    <h3 className="font-bold text-xl flex items-center gap-2"><Target size={20}/> Set New Goal</h3>
                    <button onClick={() => setIsAddGoalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-5 bg-gray-50/50">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Goal Name</label>
                        <input 
                            type="text" 
                            value={newGoal.title}
                            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                            placeholder="e.g. Improve Biology Grade" 
                            className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Goal Type</label>
                            <select 
                                value={newGoal.type}
                                onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                                className="w-full border border-gray-200 bg-white rounded-xl p-3 outline-none shadow-sm"
                            >
                                <option value="Academic">Academic</option>
                                <option value="Personal">Personal</option>
                                <option value="Study Habits">Study Habits</option>
                                <option value="College/Career">College/Career</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Achieve By</label>
                            <input 
                                type="date" 
                                value={newGoal.dueDate}
                                onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                                className="w-full border border-gray-200 bg-white rounded-xl p-3 outline-none shadow-sm" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Measurement / Details</label>
                        <textarea 
                            rows={3} 
                            value={newGoal.description}
                            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                            placeholder="How will you measure success?" 
                            className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" 
                        />
                    </div>
                    <button 
                        onClick={handleSaveGoal} 
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform active:scale-[0.98]"
                    >
                        Create Goal
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Top Branding & Navigation Row */}
      <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm text-xl">
                🦁
             </div>
             <span className="font-bold text-blue-900 text-lg bg-white px-4 py-1.5 rounded-full shadow-sm border border-blue-100">Rouse High School</span>
          </div>
          <button
            onClick={() => setKidMode(true)}
            className="bg-white border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-sm"
          >
            Switch to Elementary View
          </button>
      </div>

      {/* Hero Dashboard Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
            <div>
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Student Dashboard</div>
                <h1 className="font-extrabold text-4xl text-gray-900 tracking-tight mb-2">
                    Welcome back, {student.name.split(' ')[0]}!
                </h1>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                    <Clock size={16} className="text-gray-400"/> Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200 text-center min-w-[120px]">
                    <div className="text-2xl font-black text-green-700">{student.attendance}%</div>
                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Attendance</div>
                </div>
                <div className="flex-1 md:flex-none bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200 text-center min-w-[120px]">
                    <div className="text-2xl font-black text-blue-700">{student.gpa}</div>
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">GPA</div>
                </div>
            </div>
        </div>
      </div>

      {/* Achievements Section (Moved to Top) */}
      <section>
        <div className="flex items-center space-x-3 mb-6 pl-1">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 shadow-sm"><Trophy size={24} /></div>
            <h2 className="font-bold text-2xl text-gray-800">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition group cursor-default">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">🚀</div>
                <span className="text-sm font-bold text-gray-800">Goal Getter</span>
                <span className="text-[10px] text-gray-400 mt-1">3 Goals Met</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition group cursor-default">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">📚</div>
                <span className="text-sm font-bold text-gray-800">Bookworm</span>
                <span className="text-[10px] text-gray-400 mt-1">10 Books Read</span>
            </div>
            
            {/* Teaser Badge */}
            <div className="bg-white/60 p-4 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center text-center relative overflow-hidden opacity-70 hover:opacity-100 transition group cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🔬</div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Science Pro</span>
                
                {/* Progress Bar */}
                <div className="absolute bottom-3 w-[80%] left-1/2 -translate-x-1/2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Goals Section */}
      <section>
        <div className="flex items-center justify-between mb-6 pl-1">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm"><Target size={24} /></div>
                <h2 className="font-bold text-2xl text-gray-800">Current Goals</h2>
            </div>
            <button 
                onClick={() => setIsAddGoalOpen(true)}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 hover:border-blue-300 transition bg-white shadow-sm"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300"/> <span>New Goal</span>
            </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
          {student.goals.map((goal) => (
            <div key={goal.id} className="min-w-[320px] md:min-w-[380px] bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:border-blue-200 transition-all duration-300 snap-center group relative overflow-hidden">
              {/* Decoration */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none ${goal.type === 'IEP/504' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm ${
                      goal.type === 'IEP/504' ? 'bg-purple-100 text-purple-700' : 
                      goal.type === 'Academic' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                      {goal.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 bg-white/50 px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Calendar size={12} /> {goal.dueDate}
                  </span>
              </div>
              
              <h3 className="font-bold text-xl text-gray-800 mb-2 leading-tight relative z-10 group-hover:text-blue-700 transition-colors">{goal.title}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed relative z-10">{goal.description}</p>
              
              <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                    className={`h-full rounded-full relative ${goal.type === 'IEP/504' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                    style={{ width: `${goal.progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Goal Placeholder Card */}
          <button 
            onClick={() => setIsAddGoalOpen(true)}
            className="min-w-[100px] bg-white/40 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-white/80 hover:border-blue-300 hover:text-blue-600 transition cursor-pointer snap-center"
          >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                <Plus size={24} />
              </div>
              <span className="text-xs font-bold">Create</span>
          </button>
        </div>
      </section>

      {/* Artifacts / Backpack Section */}
      <section>
        <div className="flex items-center justify-between mb-6 pl-1">
           <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shadow-sm"><FileText size={24} /></div>
            <h2 className="font-bold text-2xl text-gray-800">My Backpack</h2>
           </div>
           <button 
             onClick={handleOpenArtifactModal}
             className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-bold text-sm hover:bg-indigo-50 hover:border-indigo-300 transition bg-white shadow-sm"
            >
             <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300"/>
             <span>Add New Work</span>
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {student.artifacts.map((artifact) => (
            <div key={artifact.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                 {/* Simulated Image Placeholders based on type - USING CENTRALIZED ASSETS */}
                 {artifact.title.includes('Math') ? (
                     <img src={ASSETS.mathImage} alt="Math" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition duration-500" />
                 ) : artifact.title.includes('Reading') ? (
                     <div className="relative w-full h-full">
                        <img src={ASSETS.readingImage} alt="Reading" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur">
                                <Video size={20} className="text-blue-600 ml-1" />
                            </div>
                        </div>
                     </div>
                 ) : (
                     <img src={ASSETS.docImage} alt="Doc" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition duration-500" />
                 )}
                 
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm uppercase tracking-wider">
                    {artifact.type}
                 </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{artifact.title}</h3>
                    {artifact.linkedGoalId && (
                        <div title="Linked to Goal" className="text-green-500 bg-green-50 p-1 rounded-full"><Target size={14} /></div>
                    )}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-1.5">
                        {artifact.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-md">{tag}</span>
                        ))}
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">{artifact.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentView;
