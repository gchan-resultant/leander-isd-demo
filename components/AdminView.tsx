
import React, { useState } from 'react';
import { DISTRICT_ANALYTICS } from '../constants';
import { DollarSign, GraduationCap, CheckCircle2, FileText, Search, LayoutGrid, Sparkles, Settings } from 'lucide-react';
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
        default: return <div className={`${baseClass} bg-gray-600`}><FileText size={24} /></div>;
    }
};

const AdminView: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);

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
  `;

  const handleTileClick = (prompt: string) => {
      setAiPrompt(prompt);
      setIsAiOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 relative overflow-x-hidden">
      
      {/* EdAssist AI Sidebar */}
      <EdAssistAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} contextData={districtContext} initialPrompt={aiPrompt} />

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
                <button onClick={() => setIsAiOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition hover:shadow-lg hover:brightness-110">
                    <Sparkles size={18} /> Launch EdAssist AI
                </button>
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
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg">
                            Explore Dashboard
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
                    {/* Report Card 1 */}
                    <div onClick={() => handleTileClick("Visualize the ESSER spending breakdown by category as a pie chart.")} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group">
                        <ReportIcon type="finance" />
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">ESSER Funding</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Track federal relief fund allocation and expenditure timelines across district programs.
                        </p>
                    </div>

                    {/* Report Card 2 */}
                    <div onClick={() => handleTileClick("Show me a bar chart of Digital Readiness metrics including Device Access and Connectivity.")} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group">
                        <ReportIcon type="school" />
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">Digital Readiness</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">School</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Device-to-student ratios, connectivity gaps, and software license utilization.
                        </p>
                    </div>

                    {/* Report Card 3 */}
                    <div onClick={() => handleTileClick("Create a bar chart showing High School Graduate Outcomes by category (College, Career, etc).")} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group">
                        <ReportIcon type="agency" />
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">HS Graduate Outcomes</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agency</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Employment and college enrollment statistics for recent graduating cohorts.
                        </p>
                    </div>

                    {/* Report Card 4 */}
                    <div onClick={() => handleTileClick("Visualize teacher compensation growth over years of experience as a line chart.")} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group">
                        <ReportIcon type="finance" />
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">Teacher Compensation</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Financial</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Analysis of salary scales, retention bonuses, and total cost of employment.
                        </p>
                    </div>

                    {/* Report Card 5 */}
                    <div onClick={() => handleTileClick("Analyze student level outcomes and flag any security concerns with data access.")} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer group">
                        <ReportIcon type="security" />
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">Student Level Outcomes</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IT Security</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Secure, row-level access to standardized test scores and growth metrics (RBAC Restricted).
                        </p>
                    </div>

                    {/* Add New Card - Placeholder for Future Expansion */}
                    <button className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center text-gray-400 hover:text-blue-600">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <Settings size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Configure Reports</h3>
                        <p className="text-sm mt-1">Manage Visibility</p>
                    </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
