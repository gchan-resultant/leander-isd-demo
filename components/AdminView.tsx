import React, { useState } from 'react';
import { DISTRICT_ANALYTICS, SUB_IMPACT_DATA, PROGRAM_ROI_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { DollarSign, Users, GraduationCap, Database, Layers, ArrowRight, FileText, Settings, CheckCircle2, RotateCcw, GripVertical, Trash2, Link as LinkIcon } from 'lucide-react';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio'>('dashboard');
  const [studioStep, setStudioStep] = useState(0); // 0: Select, 1: Build, 2: Visualize
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleReset = () => {
    setStudioStep(0);
    setSelectedScenario(null);
    setSelectedDomains([]);
  };

  // Mock step progression for the demo
  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    // Auto-select relevant domains for visual consistency
    if (scenario === 'sub_impact') setSelectedDomains(['munis', 'eschool', 'nwea']);
    if (scenario === 'program_roi') setSelectedDomains(['munis', 'nwea']);
    setStudioStep(1);
  };

  const toggleDomain = (id: string) => {
    setSelectedDomains(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
    // If we are in the builder step, we want the visualization to update immediately,
    // but we might want to reset the "Scenario" preset if the user goes off-script.
    if (studioStep === 1) {
        // Keep current step but maybe clear rigid scenario constraints
        // setSelectedScenario(null); // Optional: keep scenario styling if possible
    } else if (studioStep === 0) {
        setSelectedScenario(null);
    }
  };

  const handleConnectSources = () => {
    // Simple logic to map domain selection to demo scenarios
    const hasMunis = selectedDomains.includes('munis');
    const hasEschool = selectedDomains.includes('eschool');
    const hasNwea = selectedDomains.includes('nwea');

    if (hasMunis && hasEschool && hasNwea) {
        // If the user didn't explicitly pick the "Long Term Subs" scenario, default to 'custom'.
        // This allows the "Finance" view (Munis Finance -> eSchool -> Eduphoria) to render naturally
        // instead of forcing the "HR" view (Munis HR -> eSchool -> NWEA).
        if (selectedScenario !== 'sub_impact') {
            setSelectedScenario('custom');
        }
    } else if (hasMunis && hasNwea) {
        // If they manually picked these two, we can show the ROI view or custom
        if (!selectedScenario) setSelectedScenario('program_roi');
    } else {
        // Allow custom selections without forcing a specific scenario template
        setSelectedScenario('custom');
    }
    setStudioStep(1);
  };

  const handleBuildReport = () => {
    setStudioStep(2);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, domainId: string) => {
    e.dataTransfer.setData('domainId', domainId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Essential to allow dropping
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const domainId = e.dataTransfer.getData('domainId');
    
    if (domainId && !selectedDomains.includes(domainId)) {
       // Add the domain if not already selected
       // We call toggleDomain logic manually here to ensure state updates
       setSelectedDomains(prev => [...prev, domainId]);
       if (studioStep === 0) setSelectedScenario(null);
    }
  };

  // Helper to render domain card content based on context
  const getDomainCardContent = (domain: string) => {
    const isSubScenario = selectedScenario === 'sub_impact';
    // Defaults for custom queries (Finance centric)
    
    switch(domain) {
        case 'munis':
            return {
                title: isSubScenario ? 'Munis (HR)' : 'Munis (Finance)',
                table: isSubScenario ? 'Table: Staff_Employ' : 'Table: GL_Project_Codes',
                key: isSubScenario ? 'Key: Staff_ID' : 'Key: Program_Code',
                color: 'purple'
            };
        case 'eschool':
             return {
                title: 'eSchoolPlus',
                table: isSubScenario ? 'Table: Section_Roster' : 'Table: Student_Programs',
                key: isSubScenario ? 'Key: Primary_Teacher_ID' : 'Key: Program_Code',
                color: 'blue'
            };
        case 'nwea':
             return {
                title: isSubScenario ? 'NWEA MAP' : 'Eduphoria',
                table: isSubScenario ? 'Table: Assessment_Scores' : 'Table: Student_Growth',
                key: isSubScenario ? 'Key: Student_ID' : 'Agg: Avg_Gain',
                color: 'green'
            };
        default: 
            return { title: domain, table: 'Table: Data', key: 'Key: ID', color: 'gray' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24 space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Executive Dashboard
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
            activeTab === 'studio' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Database size={14} /> Data Studio (Ad-Hoc)
        </button>
      </div>

      {/* ----------------------------------------------------------------------------------
          VIEW 1: EXECUTIVE DASHBOARD (High Level)
         ---------------------------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">District Data Lake Insights</h1>
            <p className="text-gray-500">Consolidated View: Finance (Munis), Student Info (eSchoolPlus), Academic (NWEA/Eduphoria)</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Enrollment</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">42,500</h3>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
              </div>
              <span className="text-xs text-green-600 font-medium mt-2 block">↑ 2.1% vs Last Year</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Spend / Pupil</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">$12,450</h3>
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
              </div>
              <span className="text-xs text-gray-500 font-medium mt-2 block">Fiscal Year 2025</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Attendance</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">93.2%</h3>
                </div>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={20} /></div>
              </div>
              <span className="text-xs text-red-500 font-medium mt-2 block">↓ 0.4% vs Last Month</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">College Ready</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">76%</h3>
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><GraduationCap size={20} /></div>
              </div>
              <span className="text-xs text-green-600 font-medium mt-2 block">↑ 4% CCMR Score</span>
            </div>
          </div>

          {/* Charts Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cross-Functional Analysis */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Program ROI Analysis</h3>
              <p className="text-sm text-gray-500 mb-6">Comparing Spend per Pupil (Finance) vs. Academic Performance (NWEA)</p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="finance" name="Spend" unit="$" tick={{ fontSize: 12 }} />
                    <YAxis type="number" dataKey="performance" name="Score" unit="" domain={[70, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p>Spend: ${payload[0].value}</p>
                            <p>Score: {payload[1].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Scatter name="Campuses" data={DISTRICT_ANALYTICS} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Attendance vs Performance</h3>
              <p className="text-sm text-gray-500 mb-6">Correlation between attendance rates and academic growth</p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DISTRICT_ANALYTICS} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend />
                    <Bar dataKey="performance" name="Performance Score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------
          VIEW 2: DATA STUDIO (Report Builder Simulation)
         ---------------------------------------------------------------------------------- */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-12 gap-6 h-auto min-h-[600px]">
          
          {/* Sidebar: Data Sources (Draggable) */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Layers size={18} /> Available Domains
                </h3>
                {(selectedDomains.length > 0 || studioStep > 0) && (
                    <button 
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1"
                        title="Reset selection and start over"
                    >
                        <RotateCcw size={12} /> Reset
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-500 mb-4">Drag & drop domains into the canvas or click to select.</p>
            
            <div className="space-y-3 flex-1">
              {/* Domain Card: Munis */}
              <div 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'munis')}
                onClick={() => toggleDomain('munis')}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative cursor-grab active:cursor-grabbing hover:scale-[1.02] ${
                    selectedDomains.includes('munis') 
                    ? 'bg-purple-50 border-purple-500 shadow-sm ring-1 ring-purple-500' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-purple-900 text-sm">
                  <GripVertical size={14} className="text-gray-400" />
                  <Database size={14} /> Munis (ERP)
                </div>
                <div className="mt-2 space-y-1 ml-6">
                  <div className="text-[10px] text-purple-600 bg-white/60 px-2 py-1 rounded border border-purple-100">HR: Staff Status</div>
                  <div className="text-[10px] text-purple-600 bg-white/60 px-2 py-1 rounded border border-purple-100">Fin: General Ledger</div>
                </div>
                {selectedDomains.includes('munis') && <div className="absolute top-2 right-2 text-purple-600"><CheckCircle2 size={16}/></div>}
              </div>
              
              {/* Domain Card: eSchoolPlus */}
              <div 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'eschool')}
                onClick={() => toggleDomain('eschool')}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative cursor-grab active:cursor-grabbing hover:scale-[1.02] ${
                    selectedDomains.includes('eschool') 
                    ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm">
                  <GripVertical size={14} className="text-gray-400" />
                  <Database size={14} /> eSchoolPlus (SIS)
                </div>
                <div className="mt-2 space-y-1 ml-6">
                  <div className="text-[10px] text-blue-600 bg-white/60 px-2 py-1 rounded border border-blue-100">Roster: Class Sections</div>
                  <div className="text-[10px] text-blue-600 bg-white/60 px-2 py-1 rounded border border-blue-100">Student: Attendance</div>
                </div>
                {selectedDomains.includes('eschool') && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 size={16}/></div>}
              </div>

              {/* Domain Card: NWEA */}
              <div 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'nwea')}
                onClick={() => toggleDomain('nwea')}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative cursor-grab active:cursor-grabbing hover:scale-[1.02] ${
                    selectedDomains.includes('nwea') 
                    ? 'bg-green-50 border-green-500 shadow-sm ring-1 ring-green-500' 
                    : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-green-900 text-sm">
                  <GripVertical size={14} className="text-gray-400" />
                  <Database size={14} /> Eduphoria / NWEA
                </div>
                <div className="mt-2 space-y-1 ml-6">
                  <div className="text-[10px] text-green-600 bg-white/60 px-2 py-1 rounded border border-green-100">Scores: MAP Growth</div>
                  <div className="text-[10px] text-green-600 bg-white/60 px-2 py-1 rounded border border-green-100">Scores: STAAR</div>
                </div>
                {selectedDomains.includes('nwea') && <div className="absolute top-2 right-2 text-green-600"><CheckCircle2 size={16}/></div>}
              </div>
            </div>
            
            {/* Quick Scenarios - Keep these for ease of use */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Or Load Template</h4>
                <button 
                    onClick={() => handleScenarioSelect('sub_impact')}
                    className={`w-full text-left text-sm p-2 rounded mb-2 transition ${selectedScenario === 'sub_impact' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    1. Impact of Long-Term Subs
                </button>
                <button 
                    onClick={() => handleScenarioSelect('program_roi')}
                    className={`w-full text-left text-sm p-2 rounded transition ${selectedScenario === 'program_roi' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    2. Program TCO / ROI
                </button>
            </div>
          </div>

          {/* Main Stage: Builder & Results (Drop Target) */}
          <div className="col-span-12 md:col-span-9 flex flex-col space-y-6">
            
            {/* Step 0: Empty State (The Drop Zone) */}
            {studioStep === 0 && (
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`h-full rounded-xl flex flex-col items-center justify-center text-gray-400 p-8 text-center transition-all duration-300 min-h-[400px] ${
                        isDragOver 
                        ? 'bg-blue-50 border-2 border-blue-400 border-dashed scale-[1.01] shadow-lg' 
                        : 'bg-gray-50 border-2 border-dashed border-gray-300'
                    }`}
                >
                    {selectedDomains.length > 0 ? (
                        <div className="flex flex-col items-center animate-fadeIn pointer-events-none">
                            <div className="flex -space-x-4 mb-4">
                                {selectedDomains.includes('munis') && <div className="w-12 h-12 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 shadow-md animate-pop"><Database size={20} /></div>}
                                {selectedDomains.includes('eschool') && <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 shadow-md animate-pop"><Database size={20} /></div>}
                                {selectedDomains.includes('nwea') && <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-green-600 shadow-md animate-pop"><Database size={20} /></div>}
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">
                                {selectedDomains.length} Sources Selected
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-md">
                                Ready to join these datasets? The system will automatically detect foreign keys between Staff IDs, Student IDs, and Program Codes.
                            </p>
                            <div className="pointer-events-auto">
                                <button 
                                    onClick={handleConnectSources}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2"
                                >
                                    <LinkIcon size={18} /> Connect & Visualize
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pointer-events-none">
                            <Database size={48} className={`mb-4 transition duration-300 ${isDragOver ? 'text-blue-500 scale-110' : 'opacity-20'}`} />
                            <h3 className={`text-lg font-bold mb-2 transition ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`}>
                                {isDragOver ? 'Drop to Add Source' : 'Start Your Query'}
                            </h3>
                            <p className="max-w-sm">Drag and drop domains from the left panel here, or click them to begin building a custom query.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 1: Query Configuration & Join Logic Visualization */}
            {studioStep >= 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            {selectedScenario === 'sub_impact' ? 'Query Builder: Teacher Status Impact on Learning' : 
                             selectedScenario === 'program_roi' ? 'Query Builder: Program Cost Efficiency' : 'Query Builder: Custom Data Join'}
                        </h2>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={handleReset}
                                className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex items-center gap-2 border border-transparent hover:border-red-200"
                            >
                                <Trash2 size={16} /> Start Over
                            </button>
                            {studioStep === 1 && (
                                <button 
                                    onClick={handleBuildReport}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <Settings size={16} /> Run Query & Generate Report
                                </button>
                            )}
                        </div>
                    </div>

                    {/* The "How we handle joining" visualization */}
                    <div className="bg-slate-900 rounded-lg p-6 text-slate-300 font-mono text-sm mb-6 relative overflow-hidden min-h-[200px] flex flex-col justify-center">
                         <div className="absolute top-0 right-0 bg-slate-800 text-xs px-3 py-1 rounded-bl-lg text-slate-400">
                            Data Lake Federation Layer
                         </div>
                         
                         <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            {['munis', 'eschool', 'nwea']
                                .filter(d => selectedDomains.includes(d))
                                .map((domain, index, array) => {
                                    const content = getDomainCardContent(domain);
                                    const colorClasses = {
                                        purple: 'text-purple-400',
                                        blue: 'text-blue-400',
                                        green: 'text-green-400',
                                        gray: 'text-gray-400'
                                    };
                                    
                                    return (
                                        <React.Fragment key={domain}>
                                            <div className="bg-slate-800 p-3 rounded border border-slate-700 w-full md:w-48 text-center animate-fadeIn shadow-lg">
                                                <div className={`${colorClasses[content.color as keyof typeof colorClasses]} font-bold text-lg mb-1`}>{content.title}</div>
                                                <div className="text-xs opacity-70 border-t border-slate-700 pt-2 mt-1">{content.table}</div>
                                                <div className="text-xs mt-1 text-green-400 font-bold">{content.key}</div>
                                            </div>
                                            {index < array.length - 1 && (
                                                <ArrowRight className="text-slate-500 rotate-90 md:rotate-0 flex-shrink-0" />
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            }
                            {selectedDomains.length === 0 && (
                                <div className="text-slate-500 italic">No domains selected. Please drag domains to the canvas.</div>
                            )}
                         </div>
                         
                         <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-green-500">Verified</span> • Join Logic: LEFT OUTER JOIN • Data Freshness: Real-time
                         </div>
                    </div>
                </div>
            )}

            {/* Step 2: Visualization */}
            {studioStep === 2 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex-1 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FileText className="text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-800">Report Results</h3>
                        </div>
                        <button
                                onClick={handleReset}
                                className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex items-center gap-2 text-sm"
                            >
                                <Trash2 size={14} /> Clear Screen
                        </button>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {selectedScenario === 'sub_impact' ? (
                                <BarChart data={SUB_IMPACT_DATA} layout="vertical" margin={{top: 5, right: 30, left: 60, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="category" type="category" width={140} tick={{fontSize: 12}} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px'}} />
                                    <Legend />
                                    <Bar dataKey="avgGrowth" name="Avg RIT Growth Points" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30}>
                                    </Bar>
                                </BarChart>
                            ) : selectedScenario === 'program_roi' ? (
                                <BarChart data={PROGRAM_ROI_DATA} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="program" tick={{fontSize: 12}} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Growth Points', angle: -90, position: 'insideLeft' }}/>
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Cost Per Point ($)', angle: 90, position: 'insideRight' }} />
                                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="growthPoints" name="Growth Impact (Points)" fill="#8884d8" />
                                    <Bar yAxisId="right" dataKey="costPerPoint" name="Cost Per Point ($)" fill="#82ca9d" />
                                </BarChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <div className="text-center">
                                        <Database size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>Custom Query Results Placeholder</p>
                                        <p className="text-xs mt-1">(Select a preset scenario for demo data)</p>
                                    </div>
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {(selectedScenario === 'sub_impact' || selectedScenario === 'program_roi') && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">Automated Insight</h4>
                            <p className="text-blue-800 text-sm mt-1">
                                {selectedScenario === 'sub_impact' 
                                    ? "Data indicates a 42% drop in growth outcomes for classrooms with long-term subs (>6 weeks). Recommendation: Deploy instructional coaches to support these sections."
                                    : "The 'Online Math Intervention' program yields the highest ROI at $37 per growth point, whereas 'Reading Recovery' is most expensive but yields the highest raw growth."}
                            </p>
                        </div>
                    </div>
                    )}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;