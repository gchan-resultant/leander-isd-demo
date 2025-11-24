import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, Download, Share2, MoreVertical, RefreshCw, Calendar, Printer } from 'lucide-react';

const PilotView: React.FC = () => {
  // Mock Data for Looker Studio Simulation
  const riskData = [
    { name: 'On Track', value: 32500, color: '#10b981' },
    { name: 'Watch List', value: 6200, color: '#f59e0b' },
    { name: 'High Risk', value: 3800, color: '#ef4444' }
  ];

  const riskByGrade = [
    { grade: '9th', highRisk: 1200, watch: 1500 },
    { grade: '10th', highRisk: 950, watch: 1400 },
    { grade: '11th', highRisk: 800, watch: 1200 },
    { grade: '12th', highRisk: 850, watch: 2100 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 pb-24 font-sans text-slate-800">
      
      {/* Looker Studio Toolbar Simulation */}
      <div className="bg-white border-b border-gray-300 px-4 py-3 flex justify-between items-center mb-6 shadow-sm sticky top-0 z-20 rounded-lg">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
           </div>
           <div className="h-6 w-px bg-gray-300 mx-1"></div>
           <div>
              <h1 className="text-lg font-medium text-gray-900 leading-tight">Leander ISD - EWIS Pilot</h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                 <span>Looker Studio</span>
                 <span>•</span>
                 <span>View Mode</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" title="Refresh Data">
                <RefreshCw size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" title="Schedule Delivery">
                <Calendar size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" title="Get Report Link">
                <Share2 size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" title="Print/Download">
                <Printer size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition">
                <MoreVertical size={18} />
            </button>
        </div>
      </div>

      {/* Report Canvas */}
      <div className="bg-gray-50 border border-gray-200 min-h-[800px] shadow-inner p-6 md:p-8 rounded-lg">
          
          {/* Header Inside Canvas */}
          <div className="flex justify-between items-end border-b-2 border-blue-600 pb-2 mb-6">
             <div>
                 <h2 className="text-2xl font-bold text-slate-800">Early Warning Indicator System</h2>
                 <p className="text-slate-500">District Overview Dashboard</p>
             </div>
             <div className="text-right text-xs text-slate-400">
                 <div>Data refreshed: Oct 24, 2025</div>
                 <div>Source: District Data Lake</div>
             </div>
          </div>

          {/* Native Looker Style Filters */}
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4">
             <div className="flex flex-col min-w-[150px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1">Campus</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                        <option>All High Schools</option>
                        <option>Rouse HS</option>
                        <option>Vandegrift HS</option>
                    </select>
                    <div className="absolute right-3 top-2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
             </div>
             
             <div className="flex flex-col min-w-[150px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1">School Year</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                        <option>2024-2025</option>
                        <option>2023-2024</option>
                    </select>
                    <div className="absolute right-3 top-2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
             </div>

             <div className="flex flex-col min-w-[150px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1">Risk Category</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                        <option>High & Moderate</option>
                        <option>High Risk Only</option>
                        <option>All Students</option>
                    </select>
                    <div className="absolute right-3 top-2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
             </div>
             
             <div className="flex-1 flex justify-end items-end">
                 <button className="text-blue-600 text-xs font-medium hover:underline">Reset Filters</button>
             </div>
          </div>

          {/* Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             {/* Scorecard 1 */}
             <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-red-500 text-center">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">High Risk Count</div>
                <div className="text-3xl font-bold text-slate-800 my-2">3,800</div>
                <div className="text-red-600 text-xs font-medium bg-red-50 inline-block px-2 py-0.5 rounded">▲ 12% vs prev</div>
             </div>
             {/* Scorecard 2 */}
             <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-orange-400 text-center">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Absentee Rate</div>
                <div className="text-3xl font-bold text-slate-800 my-2">8.5%</div>
                <div className="text-gray-400 text-xs font-medium">District Avg</div>
             </div>
             {/* Scorecard 3 */}
             <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-blue-500 text-center">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Course Failures</div>
                <div className="text-3xl font-bold text-slate-800 my-2">1,240</div>
                <div className="text-green-600 text-xs font-medium bg-green-50 inline-block px-2 py-0.5 rounded">▼ 2% improvement</div>
             </div>
             {/* Scorecard 4 */}
             <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-gray-400 text-center">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Enrolled</div>
                <div className="text-3xl font-bold text-slate-800 my-2">42,500</div>
                <div className="text-gray-400 text-xs font-medium">Active</div>
             </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
             <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-4 border-b pb-2">Risk Distribution Overview</h4>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                            <Legend wrapperStyle={{fontSize: '11px'}} verticalAlign="bottom" height={24}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-4 border-b pb-2">Risk by Grade Level</h4>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskByGrade} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                            <Legend wrapperStyle={{fontSize: '11px'}} verticalAlign="bottom" height={24} />
                            <Bar dataKey="highRisk" name="High Risk" stackId="a" fill="#ef4444" />
                            <Bar dataKey="watch" name="Watch List" stackId="a" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </div>

           {/* Table */}
           <div className="bg-white rounded shadow-sm border border-gray-200">
              <h4 className="text-sm font-bold text-gray-600 p-4 border-b bg-gray-50 rounded-t">Student Detail List</h4>
              <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-600">
                      <thead className="bg-white text-gray-500 font-semibold border-b border-gray-200">
                          <tr>
                              <th className="px-4 py-3">Student ID</th>
                              <th className="px-4 py-3">Campus</th>
                              <th className="px-4 py-3">Risk Indicators</th>
                              <th className="px-4 py-3">Attendance %</th>
                              <th className="px-4 py-3 text-right">Last Contact</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {[1, 2, 3, 4, 5].map((i) => (
                              <tr key={i} className="hover:bg-blue-50 transition-colors">
                                  <td className="px-4 py-3 font-medium text-gray-900">#8492{i}</td>
                                  <td className="px-4 py-3">Rouse HS</td>
                                  <td className="px-4 py-3">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 mr-2">
                                        Attendance
                                      </span>
                                      {i % 2 === 0 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800">
                                            Grades
                                        </span>
                                      )}
                                  </td>
                                  <td className="px-4 py-3 font-bold text-gray-700">84%</td>
                                  <td className="px-4 py-3 text-right text-gray-400 italic">None recorded</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="p-2 border-t border-gray-200 text-right">
                  <span className="text-xs text-gray-400 mr-2">1-5 of 3,800 rows</span>
                  <button className="text-xs text-blue-600 font-medium hover:underline">Next &gt;</button>
              </div>
           </div>

      </div>
    </div>
  );
};

export default PilotView;