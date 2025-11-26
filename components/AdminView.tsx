
import React, { useState } from 'react';
import { DISTRICT_ANALYTICS } from '../constants';
import { DollarSign, GraduationCap, CheckCircle2, FileText, Search, LayoutGrid, Sparkles, Settings, X, Wand2, Plus, ArrowRight } from 'lucide-react';
import EdAssistAI from './EdAssistAI';

// Icons for the Report Grid (EdData style)
const ReportIcon = ({ type }: { type: string }) => {
    const baseClass = "w-12 h-12 flex items-center justify-center text-white rounded-xl shadow-sm mb-4";
    switch (type) {
        case 'public': return <div className={`${baseClass} bg-blue-600`}><LayoutGrid size={24} /></div>;
        case 'school': return <div className={`${baseClass} bg-purple-600`}><GraduationCap size={24} /></div>;
        case 'agency': return <div className={`${baseClass} bg-orange-500`}><FileText size={24} /></div>;
        case 'finance': return <div className={`${baseClass} bg-green-600`}><DollarSign size={24} /></div>;
        case 'security': return <div className={`${baseClass} bg-red-600`}><CheckCircle2 size={24} /></div>;
        case 'custom': return <div className={`${baseClass} bg-indigo-600`}><Sparkles size={24} /></div>;
        default: return <div className={`${baseClass} bg-gray-600`}><FileText size={24} /></div>;
    }
};

interface ReportTile {
    id: string;
    title: string;
    type: string;
    category: string;
    categoryColor?: string;
    description: string;
    prompt: string;
}

const INITIAL_REPORTS: ReportTile[] = [
    { 
        id: 'r1', 
        title: 'ESSER Funding', 
        type: 'finance', 
        category: 'Public', 
        description: 'Track federal relief fund allocation and expenditure timelines across district programs.',
        prompt: 'Visualize the ESSER spending breakdown by category as a pie chart.'
    },
    { 
        id: 'r2', 
        title: 'Digital Readiness', 
        type: 'school', 
        category: 'School', 
        description: 'Device-to-student ratios, connectivity gaps, and software license utilization.',
        prompt: 'Show me a bar chart of Digital Readiness metrics including Device Access and Connectivity.'
    },
    { 
        id: 'r3', 
        title: 'HS Graduate Outcomes', 
        type: 'agency', 
        category: 'Agency', 
        description: 'Employment and college enrollment statistics for recent graduating cohorts.',
        prompt: 'Create a bar chart showing High School Graduate Outcomes by category (College, Career, etc).'
    },
    { 
        id: 'r4', 
        title: 'Teacher Compensation', 
        type: 'finance', 
        category: 'Financial', 
        description: 'Analysis of salary scales, retention bonuses, and total cost of employment.',
        prompt: 'Visualize teacher compensation growth over years of experience as a line chart.'
    },
    { 
        id: 'r5', 
        title: 'Student Level Outcomes', 
        type: 'security', 
        category: 'IT Security', 
        description: 'Secure, row-level access to standardized test scores and growth metrics (RBAC Restricted).',
        prompt: 'Analyze student level outcomes and flag any security concerns with data access.'
    }
];

const AdminView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [reportTiles, setReportTiles] = useState<ReportTile[]>(INITIAL_REPORTS);
  
  // Configure Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configInput, setConfigInput] = useState('');
  const [verificationStep, setVerificationStep] = useState(false);
  const [pendingReport, setPendingReport] = useState<ReportTile | null>(null);

  // Prepare attendance data for context
  const attendanceData = DISTRICT_ANALYTICS.map(d => ({ name: d.name, value: d.attendance }));

  // District Context for AI - Updated with specific data for charts
  const districtContext = `
    District: Leander ISD.
    Enrollment: 42,500.
    Strategic Goals: Improve Digital Readiness, Optimize Federal Funding (ESSER), Increase Graduate Employment.
    
    Data for Visualization:
    1. ESSER Spending: { "Instruction": 45, "Facilities": 30, "Technology": 15, "Mental Health": 10 } (Percentage).
    2. Digital Readiness: { "Devices": 98, "Connectivity": 95, "LMS Usage": 82 } (Percentage).
    3. Graduate Outcomes: { "College": 65, "Career": 25, "Military": 5, "Undecided": 5 } (Percentage).
    4. Teacher Pay: { "Starting": 54000, "5 Years": 58000, "10 Years": 62000, "15+ Years": 70000 } (Salary in USD).
    5. Student Attendance by Campus: ${JSON.stringify(attendanceData)} (Percentage).
  `;

  const handleTileClick = (prompt: string) => {
      setAiPrompt(prompt);
      setIsAiOpen(true);
  };

  const handleVerifyReport = () => {
    if (!configInput.trim()) return;
    
    // Simulate AI parsing the natural language to determine report details
    let suggestedTitle = "Custom Analysis Report";
    let suggestedType = "bar";
    
    if (configInput.toLowerCase().includes("attendance")) suggestedTitle = "Attendance Trends";
    else if (configInput.toLowerCase().includes("score")) suggestedTitle = "Assessment Scores";
    else if (configInput.toLowerCase().includes("budget")) suggestedTitle = "Budget Analysis";
    
    const newReport: ReportTile = {
        id: `custom-${Date.now()}`,
        title: suggestedTitle,
        type: 'custom',
        category: 'Custom Report',
        description: `Generated from request: "${configInput.substring(0, 50)}${configInput.length > 50 ? '...' : ''}"`,
        prompt: configInput // Store the full user prompt to send to AI later
    };

    setPendingReport(newReport);
    setVerificationStep(true);
  };

  const handleApproveReport = () => {
      if (pendingReport) {
          setReportTiles([...reportTiles, pendingReport]);
          setVerificationStep(false);
          setPendingReport(null);
          setConfigInput('');
          setIsConfigModalOpen(false);
      }
  };

  const handleCloseModal = () => {
      setIsConfigModalOpen(false);
      setVerificationStep(false);
      setPendingReport(null);
      setConfigInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 relative overflow-x-hidden">
      
      {/* EdAssist AI Sidebar */}
      <EdAssistAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} contextData={districtContext} initialPrompt={aiPrompt} role="District Administrator" />

      {/* Configure Report Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
                <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Settings size={20} />
                        <h3 className="font-bold text-lg">
                            {verificationStep ? "Verify & Create Report" : "Configure Custom Report"}
                        </h3>
                    </div>
                    <button onClick={handleCloseModal} className="hover:bg-white/20 p-1 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    {!verificationStep ? (
                        <>
                            <p className="text-gray-600 text-sm mb-4">
                                Describe the data, filters, and visualization type you need. EdAssist will draft the configuration for you.
                            </p>
                            <textarea 
                                value={configInput}
                                onChange={(e) => setConfigInput(e.target.value)}
                                placeholder="e.g., 'Create a bar chart showing student attendance trends broken down by high school campus for the last semester.'"
                                className="w-full h-32 border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-4"
                            />
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleVerifyReport}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-sm shadow-md flex items-center gap-2 hover:shadow-lg transition"
                                >
                                    <Wand2 size={16} /> Draft Configuration
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Proposed Tile Configuration</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Report Title:</span>
                                        <span className="text-sm font-bold text-gray-900">{pendingReport?.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Category:</span>
                                        <span className="text-sm font-bold text-gray-900">{pendingReport?.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Data Source:</span>
                                        <span className="text-sm font-bold text-gray-900">District Data Lake (BigQuery)</span>
                                    </div>
                                    <div className="pt-2 border-t border-indigo-200 mt-2">
                                        <span className="text-xs text-gray-500 block mb-1">AI Prompt Context:</span>
                                        <p className="text-xs text-gray-700 italic">"{pendingReport?.prompt}"</p>
                                    </div>
                                </div>
                             </div>
                             <p className="text-sm text-gray-600">
                                This will create a new tile on your dashboard. Clicking it will automatically trigger the analysis defined above.
                             </p>
                             <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setVerificationStep(false)}
                                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition"
                                >
                                    Back to Edit
                                </button>
                                <button 
                                    onClick={handleApproveReport}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm shadow-md flex items-center gap-2 hover:bg-green-700 transition"
                                >
                                    <CheckCircle2 size={16} /> Approve & Create Tile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className={`transition-all duration-300 ease-in-out ${isAiOpen ? 'mr-0 md:mr-[450px]' : ''}`}>
        {/* White Header (Matching Teacher View) */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg">
                <LayoutGrid size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-gray-900 leading-none">EdData</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Leander ISD • District Dashboard</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current View</div>
                    <div className="text-sm font-bold text-gray-700">District Administrator</div>
                </div>
            </div>
        </div>

        {/* Hero Section (EdData Style) */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">Popular</div>
                        <h1 className="text-4xl font-bold mb-4">Digital Readiness Dashboard</h1>
                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                            A comprehensive view of district-wide technology adoption, LMS usage stats, and student connectivity metrics across all 45 campuses.
                        </p>
                        <button 
                            onClick={() => setIsAiOpen(true)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2"
                        >
                            <Sparkles size={18} /> Launch EdAssist AI
                        </button>
                    </div>
                    {/* Abstract Hexagon Graphic */}
                    <div className="hidden md:block relative">
                        <div className="grid grid-cols-3 gap-4 opacity-20">
                            <div className="w-20 h-24 bg-white clip-hex"></div>
                            <div className="w-20 h-24 bg-blue-400 clip-hex translate-y-12"></div>
                            <div className="w-20 h-24 bg-white clip-hex"></div>
                        </div>
                    </div>
                </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-20 z-20">
                <div className="max-w-7xl mx-auto px-6 py-3 flex gap-6 overflow-x-auto text-sm font-medium text-gray-500">
                    <button className="text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3.5">All Reports</button>
                    <button className="hover:text-gray-800 transition pb-3">Public</button>
                    <button className="hover:text-gray-800 transition pb-3">School</button>
                    <button className="hover:text-gray-800 transition pb-3">Agency</button>
                    <button className="hover:text-gray-800 transition pb-3">Operational</button>
                    <button className="hover:text-gray-800 transition pb-3">Financial</button>
                </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
            
            {/* PORTAL VIEW - THE REPORT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Render Reports from State */}
                    {reportTiles.map((report) => (
                        <div 
                            key={report.id}
                            onClick={() => handleTileClick(report.prompt)} 
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
                        >
                            {report.type === 'custom' && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">New</div>
                            )}
                            <ReportIcon type={report.type} />
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">{report.title}</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{report.category}</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                {report.description}
                            </p>
                            <div className="mt-4 flex items-center text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                View Report <ArrowRight size={12} className="ml-1" />
                            </div>
                        </div>
                    ))}

                    {/* Configure Reports - Trigger Tile */}
                    <button 
                        onClick={() => setIsConfigModalOpen(true)}
                        className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 group min-h-[250px]"
                    >
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Configure Reports</h3>
                        <p className="text-sm mt-1">Add Custom View</p>
                    </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
