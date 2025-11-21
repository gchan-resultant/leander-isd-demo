import React, { useState } from 'react';
import { MOCK_STUDENT } from '../constants';
import { Target, Trophy, Upload, FileText, Image as ImageIcon, User, Star, BookOpen, Sun, Smile, Rocket } from 'lucide-react';

const StudentView: React.FC = () => {
  const [kidMode, setKidMode] = useState(false); // Toggle between Elementary/HS UI
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 1500); // Simulate upload
  };

  const student = MOCK_STUDENT;

  // ----------------------------------------------------------------------
  // ELEMENTARY MODE LAYOUT
  // ----------------------------------------------------------------------
  if (kidMode) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 bg-sky-50 min-h-screen font-sans">
        
        {/* Top Navigation / Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-blue-200 shadow-sm text-2xl">
                🦁
             </div>
             <span className="font-bold text-blue-800 text-lg bg-blue-100 px-4 py-1 rounded-full">Leander ISD</span>
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
                        <div className="text-3xl font-bold">92%</div>
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
                        onClick={handleUpload}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition"
                    >
                        {uploading ? <span className="animate-spin block">⌛</span> : <Upload size={24} />}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {student.artifacts.map((artifact) => (
                        <div key={artifact.id} className="bg-white p-3 pb-4 rounded-3xl border-b-4 border-r-4 border-gray-200 hover:border-blue-300 hover:translate-y-[-2px] transition cursor-pointer flex flex-col h-full">
                            <div className="aspect-square bg-gray-100 rounded-2xl mb-3 overflow-hidden relative">
                                <img src={artifact.url} alt={artifact.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-gray-600 backdrop-blur-sm">
                                    {artifact.type === 'image' ? <ImageIcon size={16}/> : <FileText size={16}/>}
                                </div>
                            </div>
                            <h4 className="font-bold text-gray-700 leading-tight mb-1">{artifact.title}</h4>
                            <span className="text-xs text-gray-400 font-bold mt-auto">{artifact.date}</span>
                        </div>
                    ))}
                     
                     {/* Add New Placeholder */}
                     <button onClick={handleUpload} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition aspect-square">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                            <span className="text-2xl font-bold">+</span>
                        </div>
                        <span className="font-bold text-sm">Add Stuff</span>
                     </button>
                </div>

                {/* Trophy Case */}
                <div className="bg-yellow-50 border-2 border-yellow-100 rounded-3xl p-6 mt-6">
                    <div className="flex items-center gap-2 mb-4 text-yellow-800">
                        <Trophy size={24} />
                        <h3 className="font-bold text-xl">Trophy Case</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <div className="bg-white p-3 rounded-2xl border border-yellow-100 shadow-sm text-center min-w-[80px]">
                            <div className="text-3xl mb-1">🚀</div>
                            <div className="text-[10px] font-bold text-gray-600 uppercase">Blast Off</div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-yellow-100 shadow-sm text-center min-w-[80px]">
                            <div className="text-3xl mb-1">📚</div>
                            <div className="text-[10px] font-bold text-gray-600 uppercase">Reader</div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-2xl border-2 border-dashed border-yellow-200 text-center min-w-[80px] flex items-center justify-center">
                            <span className="text-yellow-300 font-bold text-2xl">?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // HIGH SCHOOL MODE LAYOUT (Original)
  // ----------------------------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-bold text-3xl text-gray-900">
            Hi, {student.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500">Welcome to your Digital Backpack</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-600">UI Mode:</span>
          <button
            onClick={() => setKidMode(false)}
            className="px-3 py-1 rounded-md text-sm transition bg-blue-100 text-blue-700 font-bold"
          >
            High School
          </button>
          <button
            onClick={() => setKidMode(true)}
            className="px-3 py-1 rounded-md text-sm transition text-gray-500 hover:bg-gray-50"
          >
            Elementary
          </button>
        </div>
      </div>

      {/* Goals Section */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Target className="text-blue-600" />
          <h2 className="font-bold text-xl">My Goals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {student.goals.map((goal) => (
            <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden">
              {goal.type === 'IEP/504' && (
                 <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Personalized Plan
                 </div>
              )}
              <h3 className="font-bold text-lg text-gray-800 mb-2">{goal.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{goal.description}</p>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio / Backpack Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center space-x-2">
            <FileText className="text-indigo-600" />
            <h2 className="font-bold text-xl">My Artifacts</h2>
           </div>
           <button 
             onClick={handleUpload}
             className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition transform hover:scale-105 bg-indigo-600 hover:bg-indigo-700"
            >
             {uploading ? <span>Uploading...</span> : (
                 <>
                    <Upload size={18} />
                    <span>Add New Work</span>
                 </>
             )}
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {student.artifacts.map((artifact) => (
            <div key={artifact.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition cursor-pointer">
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img src={artifact.url} alt={artifact.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                   {artifact.type === 'image' ? <ImageIcon size={12}/> : <FileText size={12}/>}
                   <span>{artifact.date}</span>
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{artifact.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                    {artifact.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{tag}</span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges Section - Gamification */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
            <Trophy className="text-yellow-500" />
            <h2 className="font-bold text-xl">My Achievements</h2>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-wrap gap-4">
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm w-28 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl mb-2">🚀</div>
                <span className="text-xs font-bold text-gray-700">Goal Getter</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm w-28 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-2">📚</div>
                <span className="text-xs font-bold text-gray-700">Bookworm</span>
            </div>
             <div className="flex flex-col items-center p-3 bg-white/50 rounded-xl border-2 border-dashed border-gray-300 w-28 text-center justify-center h-28">
                <span className="text-xs text-gray-400">Next Badge</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default StudentView;