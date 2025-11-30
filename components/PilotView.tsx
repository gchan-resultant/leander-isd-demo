import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Filter, Download, Share2, MoreVertical, RefreshCw, Calendar, Printer, LayoutGrid, Users, AlertCircle, Clock, ChevronRight, FileText } from 'lucide-react';

const PilotView: React.FC = () => {
  const [activePage, setActivePage] = useState<'overview' | 'attendance' | 'discipline'>('overview');
  
  // Filter States
  const [year, setYear] = useState('2024-2025');
  const [campus, setCampus] = useState('All Campuses');
  const [grade, setGrade] = useState('All Grades');

  const handleReset = () => {
      setYear('2024-2025');
      setCampus('All Campuses');
      setGrade('All Grades');
  };

  // --------------------------------------------------------------------------
  // DYNAMIC MOCK DATA GENERATION
  // --------------------------------------------------------------------------
  const dashboardData = useMemo(() => {
    // Multipliers for generating realistic variations
    const isPastYear = year === '2023-2024';
    const isSingleCampus = campus !== 'All Campuses';
    
    // Determine context based on filters (Grade filter takes precedence for logic if specific)
    const isHighSchoolContext = grade === 'High School (9-12)' || (grade === 'All Grades' && campus.includes('HS'));
    const isElementaryContext = grade === 'Elementary (PK-5)'; // No Elem campuses in list, but good for logic
    const isMiddleSchoolContext = grade === 'Middle School (6-8)';

    // 1. Enrollment Logic
    let baseEnrollment = 42500; // District Base
    
    if (isSingleCampus) {
        baseEnrollment = 2400; // Campus Base
        if (campus === 'Vandegrift HS') baseEnrollment += 400;
        if (campus === 'Rouse HS') baseEnrollment -= 200;
    } else {
        // District Level Scaling by Grade Band
        if (isHighSchoolContext) baseEnrollment = Math.floor(42500 * 0.32);
        if (isMiddleSchoolContext) baseEnrollment = Math.floor(42500 * 0.24);
        if (isElementaryContext) baseEnrollment = Math.floor(42500 * 0.44);
    }

    if (isPastYear) baseEnrollment = Math.floor(baseEnrollment * 0.98); // Slightly lower last year

    // Generate trend based on base enrollment
    const enrollmentTrend = [
        { month: 'Aug', value: Math.floor(baseEnrollment * 0.98) },
        { month: 'Sep', value: Math.floor(baseEnrollment * 0.99) },
        { month: 'Oct', value: Math.floor(baseEnrollment * 1.00) },
        { month: 'Nov', value: Math.floor(baseEnrollment * 1.005) },
        { month: 'Dec', value: Math.floor(baseEnrollment * 1.008) },
    ];

    // 2. Demographics Logic (Campus specific profiles)
    let demographicData;
    if (campus === 'Vandegrift HS') {
        demographicData = [
            { name: 'Eco. Disadvantaged', value: 8, color: '#3b82f6' },
            { name: 'Special Ed', value: 9, color: '#8b5cf6' },
            { name: 'EB / EL', value: 5, color: '#10b981' },
            { name: 'Non-Categorical', value: 78, color: '#9ca3af' },
        ];
    } else if (campus === 'Leander HS') {
        demographicData = [
            { name: 'Eco. Disadvantaged', value: 42, color: '#3b82f6' },
            { name: 'Special Ed', value: 14, color: '#8b5cf6' },
            { name: 'EB / EL', value: 22, color: '#10b981' },
            { name: 'Non-Categorical', value: 22, color: '#9ca3af' },
        ];
    } else if (campus === 'Rouse HS') {
         demographicData = [
            { name: 'Eco. Disadvantaged', value: 22, color: '#3b82f6' },
            { name: 'Special Ed', value: 11, color: '#8b5cf6' },
            { name: 'EB / EL', value: 12, color: '#10b981' },
            { name: 'Non-Categorical', value: 55, color: '#9ca3af' },
        ];
    } else {
        // District Average
        demographicData = [
            { name: 'Eco. Disadvantaged', value: 35, color: '#3b82f6' },
            { name: 'Special Ed', value: 12, color: '#8b5cf6' },
            { name: 'EB / EL', value: 18, color: '#10b981' },
            { name: 'Non-Categorical', value: 35, color: '#9ca3af' },
        ];
    }

    // 3. Attendance Logic
    let baseAttendance = 95.5;
    if (isPastYear) baseAttendance -= 1.5; // Post-COVID lower
    
    // Grade level impact on attendance
    if (isHighSchoolContext) baseAttendance -= 1.8; // HS typically lower
    if (isMiddleSchoolContext) baseAttendance -= 0.5;
    if (isElementaryContext) baseAttendance += 1.2; // Elementary typically higher

    if (campus === 'Vandegrift HS') baseAttendance += 1.5; // Higher performing
    if (campus === 'Leander HS') baseAttendance -= 1.0;

    // Clamp between 0 and 100
    const ada = Math.min(99, Math.max(80, baseAttendance));
    
    const attendanceTrend = [
        { month: 'Aug', rate: +(ada + 1.2).toFixed(1), goal: 96 },
        { month: 'Sep', rate: +(ada + 0.5).toFixed(1), goal: 96 },
        { month: 'Oct', rate: +(ada - 0.2).toFixed(1), goal: 96 },
        { month: 'Nov', rate: +(ada - 0.8).toFixed(1), goal: 96 },
        { month: 'Dec', rate: +(ada - 1.5).toFixed(1), goal: 96 },
    ];

    // 4. Discipline Logic
    let baseIncidents = isSingleCampus ? 40 : 450;
    
    // Scale incidents based on population size logic roughly
    if (isHighSchoolContext && !isSingleCampus) baseIncidents = 180;
    if (isMiddleSchoolContext && !isSingleCampus) baseIncidents = 150;
    if (isElementaryContext && !isSingleCampus) baseIncidents = 80;

    if (campus === 'Leander HS') baseIncidents *= 1.2;
    
    // Scale types based on grade level context
    let disciplineTypes = [
        { name: 'Disruptive Behavior', value: Math.floor(baseIncidents * 0.45), color: '#f59e0b' },
        { name: 'Tardy', value: Math.floor(baseIncidents * 0.35), color: '#3b82f6' },
        { name: 'Code of Conduct', value: Math.floor(baseIncidents * 0.15), color: '#ef4444' },
        { name: 'Other', value: Math.floor(baseIncidents * 0.05), color: '#9ca3af' },
    ];

    if (isElementaryContext) {
         disciplineTypes = [
            { name: 'Disruptive Behavior', value: Math.floor(baseIncidents * 0.70), color: '#f59e0b' },
            { name: 'Physical Aggression', value: Math.floor(baseIncidents * 0.20), color: '#ef4444' },
            { name: 'Other', value: Math.floor(baseIncidents * 0.10), color: '#9ca3af' },
        ];
    }

    // 5. Chronic Absenteeism by Grade - Filtered
    let allGradesChronic = [
        { grade: 'PK', pct: 15 }, { grade: 'KG', pct: 12 }, { grade: '01', pct: 8 },
        { grade: '02', pct: 7 }, { grade: '03', pct: 6 }, { grade: '04', pct: 6 },
        { grade: '05', pct: 7 }, { grade: '06', pct: 9 }, { grade: '07', pct: 10 },
        { grade: '08', pct: 11 }, { grade: '09', pct: 14 }, { grade: '10', pct: 16 },
        { grade: '11', pct: 18 }, { grade: '12', pct: 22 },
    ];

    let filteredChronicData = allGradesChronic;
    if (isHighSchoolContext) {
        filteredChronicData = allGradesChronic.filter(d => ['09','10','11','12'].includes(d.grade));
    } else if (isMiddleSchoolContext) {
        filteredChronicData = allGradesChronic.filter(d => ['06','07','08'].includes(d.grade));
    } else if (isElementaryContext) {
        filteredChronicData = allGradesChronic.filter(d => ['PK','KG','01','02','03','04','05'].includes(d.grade));
    }

    return {
        enrollmentTotal: enrollmentTrend[enrollmentTrend.length-1].value,
        attendanceRate: ada.toFixed(1),
        chronicAbsentPct: (100 - ada + 4).toFixed(1), // Rough correlation
        incidentTotal: Math.floor(baseIncidents * 1.2), // Total over time
        enrollmentTrend,
        demographicData,
        attendanceTrend,
        disciplineTypes,
        chronicAbsenteeismByGrade: filteredChronicData,
        disciplineByMonth: [
            { month: 'Aug', incidents: Math.floor(baseIncidents * 0.6) },
            { month: 'Sep', incidents: Math.floor(baseIncidents * 0.9) },
            { month: 'Oct', incidents: Math.floor(baseIncidents * 1.1) },
            { month: 'Nov', incidents: Math.floor(baseIncidents * 1.0) },
            { month: 'Dec', incidents: Math.floor(baseIncidents * 0.8) },
        ]
    };
  }, [year, campus, grade]);

  return (
    <div className="max-w-7xl mx-auto p-6 pb-24 font-sans text-slate-800">
      
      {/* Looker Studio Toolbar Simulation */}
      <div className="bg-white border-b border-gray-300 px-4 py-3 flex justify-between items-center mb-6 shadow-sm sticky top-0 z-20 rounded-lg">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-vt-blue rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
           </div>
           <div className="h-6 w-px bg-gray-300 mx-1"></div>
           <div>
              <h1 className="text-lg font-medium text-gray-900 leading-tight">Leander ISD - District Dashboard</h1>
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

      <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Navigation (Simulating Looker Pages) */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Report Pages
                </div>
                <button 
                    onClick={() => setActivePage('overview')}
                    className={`w-full flex items-center justify-between p-3 text-sm font-medium transition border-l-4 ${activePage === 'overview' ? 'bg-vt-blue/10 text-vt-blue border-vt-blue' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                >
                    <div className="flex items-center gap-3">
                        <LayoutGrid size={16} /> District Overview
                    </div>
                    {activePage === 'overview' && <ChevronRight size={14} />}
                </button>
                <button 
                    onClick={() => setActivePage('attendance')}
                    className={`w-full flex items-center justify-between p-3 text-sm font-medium transition border-l-4 ${activePage === 'attendance' ? 'bg-vt-blue/10 text-vt-blue border-vt-blue' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                >
                    <div className="flex items-center gap-3">
                        <Clock size={16} /> Attendance Insights
                    </div>
                    {activePage === 'attendance' && <ChevronRight size={14} />}
                </button>
                <button 
                    onClick={() => setActivePage('discipline')}
                    className={`w-full flex items-center justify-between p-3 text-sm font-medium transition border-l-4 ${activePage === 'discipline' ? 'bg-vt-blue/10 text-vt-blue border-vt-blue' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle size={16} /> Behavior & Discipline
                    </div>
                    {activePage === 'discipline' && <ChevronRight size={14} />}
                </button>
             </div>

             {/* Filters Panel */}
             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4 sticky top-24">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-sm border-b pb-2">
                    <Filter size={16} /> Report Filters
                </div>
                
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500">School Year</label>
                    <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-vt-grey border border-vt-borderGrey rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-vt-lightBlue outline-none text-vt-textGrey"
                    >
                        <option>2024-2025</option>
                        <option>2023-2024</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500">Campus</label>
                    <select 
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full bg-vt-grey border border-vt-borderGrey rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-vt-lightBlue outline-none text-vt-textGrey"
                    >
                        <option>All Campuses</option>
                        <option>Rouse HS</option>
                        <option>Vandegrift HS</option>
                        <option>Leander HS</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500">Grade Level</label>
                    <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-vt-grey border border-vt-borderGrey rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-vt-lightBlue outline-none text-vt-textGrey"
                    >
                        <option>All Grades</option>
                        <option>High School (9-12)</option>
                        <option>Middle School (6-8)</option>
                        <option>Elementary (PK-5)</option>
                    </select>
                </div>
                
                <button 
                    onClick={handleReset}
                    className="w-full py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded hover:bg-gray-200 transition"
                >
                    Reset All
                </button>
             </div>
          </div>

          {/* Main Report Canvas */}
          <div className="flex-1 bg-gray-50 border border-gray-200 min-h-[800px] shadow-inner p-6 md:p-8 rounded-lg animate-fadeIn">
              
              {/* Header Inside Canvas */}
              <div className="flex justify-between items-end border-b-2 border-vt-blue pb-2 mb-6">
                 <div>
                     <h2 className="text-2xl font-bold text-slate-800">
                        {activePage === 'overview' && 'District Executive Summary'}
                        {activePage === 'attendance' && 'Attendance & Chronic Absenteeism'}
                        {activePage === 'discipline' && 'Student Conduct & Discipline'}
                     </h2>
                     <p className="text-slate-500 text-sm">Real-time data from District Data Lake (BigQuery)</p>
                 </div>
                 <div className="text-right text-xs text-slate-400">
                     <div>Data refreshed: Oct 24, 2025</div>
                     <div className="font-semibold text-slate-600 mt-1">Filters: {campus} • {grade} • {year}</div>
                 </div>
              </div>

              {/* --------------------------------------------------------------------------
                  PAGE 1: OVERVIEW
                 -------------------------------------------------------------------------- */}
              {activePage === 'overview' && (
                <div className="space-y-6">
                    {/* Scorecards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-vt-blue">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Enrollment</div>
                            <div className="text-3xl font-bold text-slate-800 my-1">{dashboardData.enrollmentTotal.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Active Students</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-green-500">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Attendance Rate (YTD)</div>
                            <div className="text-3xl font-bold text-slate-800 my-1">{dashboardData.attendanceRate}%</div>
                            <div className={`text-xs font-bold ${year === '2023-2024' ? 'text-red-600' : 'text-green-600'}`}>
                                {year === '2023-2024' ? '▼ 1.5% vs Prior' : '▲ 0.4% vs Last Year'}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-red-500">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Chronically Absent</div>
                            <div className="text-3xl font-bold text-slate-800 my-1">{dashboardData.chronicAbsentPct}%</div>
                            <div className="text-xs text-red-600 font-bold">Risk Level: Moderate</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-t-orange-500">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Discipline Incidents</div>
                            <div className="text-3xl font-bold text-slate-800 my-1">{dashboardData.incidentTotal}</div>
                            <div className="text-xs text-orange-600 font-bold">Last 30 Days</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enrollment Trend */}
                        <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">Enrollment Trend (YTD)</h4>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.enrollmentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#004f8a" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#004f8a" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <YAxis domain={['dataMin - 50', 'dataMax + 50']} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                                        <Area type="monotone" dataKey="value" stroke="#004f8a" strokeWidth={2} fillOpacity={1} fill="url(#colorEnroll)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Demographics */}
                        <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">Student Demographics ({campus === 'All Campuses' ? 'District' : 'Campus'})</h4>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.demographicData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {dashboardData.demographicData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color === '#3b82f6' ? '#004f8a' : entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '11px'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* --------------------------------------------------------------------------
                  PAGE 2: ATTENDANCE
                 -------------------------------------------------------------------------- */}
              {activePage === 'attendance' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Monthly Trend */}
                        <div className="lg:col-span-2 bg-white p-5 rounded shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">Average Daily Attendance (ADA) vs Goal</h4>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dashboardData.attendanceTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <YAxis domain={['dataMin - 2', 100]} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                                        <Legend />
                                        <Line name="ADA %" type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                        <Line name="District Goal (96%)" type="monotone" dataKey="goal" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Summary Stat */}
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded shadow-sm border-l-4 border-l-red-500 h-1/2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Severe Chronic Absence</h4>
                                <div className="text-3xl font-bold text-gray-800 mt-2">
                                    {Math.floor(dashboardData.enrollmentTotal * (parseFloat(dashboardData.chronicAbsentPct)/100) * 0.4)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Students missing 20%+ days</div>
                            </div>
                             <div className="bg-white p-5 rounded shadow-sm border-l-4 border-l-orange-400 h-1/2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">At-Risk Attendance</h4>
                                <div className="text-3xl font-bold text-gray-800 mt-2">
                                    {Math.floor(dashboardData.enrollmentTotal * (parseFloat(dashboardData.chronicAbsentPct)/100) * 0.8)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Students missing 10-20% days</div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown by Grade */}
                    <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-700 mb-4">Chronic Absenteeism Rate by Grade Level (%)</h4>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.chronicAbsenteeismByGrade} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} unit="%" />
                                    <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="pct" name="% Chronically Absent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
              )}

              {/* --------------------------------------------------------------------------
                  PAGE 3: DISCIPLINE
                 -------------------------------------------------------------------------- */}
              {activePage === 'discipline' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Incident Trend */}
                        <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">Discipline Incidents - Monthly Trend</h4>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dashboardData.disciplineByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} cursor={{fill: '#f3f4f6'}} />
                                        <Bar dataKey="incidents" fill="#004f8a" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Incident Types */}
                        <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">Incidents by Category ({grade === 'All Grades' ? 'All' : grade})</h4>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.disciplineTypes}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {dashboardData.disciplineTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color === '#3b82f6' ? '#004f8a' : entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '11px'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Student Detail List */}
                    <div className="bg-white rounded shadow-sm border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-600 p-4 border-b bg-gray-50 rounded-t flex justify-between items-center">
                            <span>Recent Incident Log</span>
                            <button className="text-vt-blue text-xs flex items-center gap-1 hover:underline"><Download size={12}/> Export CSV</button>
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-gray-600">
                                <thead className="bg-white text-gray-500 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Student ID</th>
                                        <th className="px-4 py-3">Campus</th>
                                        <th className="px-4 py-3">Incident Type</th>
                                        <th className="px-4 py-3">Action Taken</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3">Oct 24, 2025</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">#84921</td>
                                        <td className="px-4 py-3">Rouse HS</td>
                                        <td className="px-4 py-3"><span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-medium">Disruptive Behavior</span></td>
                                        <td className="px-4 py-3">Parent Conference</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3">Oct 23, 2025</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">#99283</td>
                                        <td className="px-4 py-3">Leander HS</td>
                                        <td className="px-4 py-3"><span className="text-vt-blue bg-blue-50 px-2 py-0.5 rounded font-medium">Excessive Tardy</span></td>
                                        <td className="px-4 py-3">Detention</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3">Oct 22, 2025</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">#12344</td>
                                        <td className="px-4 py-3">Vandegrift HS</td>
                                        <td className="px-4 py-3"><span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium">Code of Conduct</span></td>
                                        <td className="px-4 py-3">Suspension (ISS)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default PilotView;