import React, { useState } from 'react';
import { MOCK_STUDENT } from '../constants';
import { Globe, TrendingUp, Activity, CheckCircle, Calendar, Mail, FileText, History, X, Printer, School } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ParentView: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [chartMode, setChartMode] = useState<'yearly' | 'monthly'>('yearly');
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const student = MOCK_STUDENT;

  const translations = {
    en: {
      welcome: "Welcome, Parent of",
      overview: "Academic Overview",
      attendance: "Attendance Rate",
      risk: "On Track Status",
      ewis: "Early Warning Indicator",
      goals: "Active Goals",
      historic: "Past Achievements",
      contact: "Contact Teacher",
      iep: "504 Plan / IEP",
      viewReport: "View Report",
      status: {
        track: "On Track",
        risk: "Needs Attention"
      },
      chart: {
        yearly: "Yearly (Historic)",
        monthly: "Monthly",
        axis: "Risk Score (Lower is Better)",
        footer: "*Early Warning Indicator aggregates Attendance, Behavior, and Course Performance. Lower scores indicate better performance."
      },
      reportCard: {
        title: "Student Report Card & Accommodations",
        semester: "Fall Semester 2025",
        print: "Print",
        table: {
            period: "Period",
            course: "Course",
            teacher: "Teacher",
            absences: "Absences",
            grade: "Current Grade"
        },
        accommodationsTitle: "504 Plan Accommodations Applied",
        accommodationsList: [
            "Preferential seating near instruction.",
            "Extended time on math assessments (1.5x).",
            "Small group testing environment.",
            "Use of calculator for science applications."
        ]
      },
      historicCompleted: "Completed"
    },
    es: {
      welcome: "Bienvenido, Padre de",
      overview: "Resumen Académico",
      attendance: "Tasa de Asistencia",
      risk: "Estado de Progreso",
      ewis: "Indicador de Alerta Temprana",
      goals: "Metas Activas",
      historic: "Logros Pasados",
      contact: "Contactar Maestro",
      iep: "Plan 504 / IEP",
      viewReport: "Ver Reporte",
      status: {
        track: "En Camino",
        risk: "Necesita Atención"
      },
      chart: {
        yearly: "Anual (Histórico)",
        monthly: "Mensual",
        axis: "Puntaje de Riesgo (Menor es Mejor)",
        footer: "*El Indicador de Alerta Temprana agrega Asistencia, Comportamiento y Desempeño Académico. Puntajes más bajos indican mejor desempeño."
      },
      reportCard: {
        title: "Boleta de Calificaciones y Adaptaciones",
        semester: "Semestre de Otoño 2025",
        print: "Imprimir",
        table: {
            period: "Período",
            course: "Curso",
            teacher: "Maestro",
            absences: "Ausencias",
            grade: "Calif. Actual"
        },
        accommodationsTitle: "Adaptaciones del Plan 504 Aplicadas",
        accommodationsList: [
            "Asientos preferenciales cerca de la instrucción.",
            "Tiempo extendido en evaluaciones de matemáticas (1.5x).",
            "Entorno de prueba en grupos pequeños.",
            "Uso de calculadora para aplicaciones científicas."
        ]
      },
      historicCompleted: "Completado"
    }
  };

  const t = translations[language];

  // Helper to translate specific mock data strings based on language
  const translateGoalText = (text: string) => {
    if (language === 'en') return text;
    
    const map: Record<string, string> = {
        // Active Goals
        "Improve Math RIT Score": "Mejorar Puntaje RIT de Matemáticas",
        "Increase NWEA MAP Math score from 230 to 245 by end of semester.": "Aumentar el puntaje de NWEA MAP de 230 a 245 para el final del semestre.",
        "Reading Fluency": "Fluidez en la Lectura",
        "Accommodated reading goal per 504 plan: Read 150 wpm.": "Meta de lectura adaptada según plan 504: Leer 150 ppm.",
        "Academic": "Académico",
        "IEP/504": "IEP/504",
        "Personal": "Personal",
        
        // Historic Goals
        "Biology Lab Safety": "Seguridad en Laboratorio de Biología",
        "Complete all safety modules with 100% accuracy.": "Completar todos los módulos de seguridad con 100% de precisión.",
        "Join Robotics Club": "Unirse al Club de Robótica",
        "Participate in at least 3 regional meets.": "Participar en al menos 3 encuentros regionales."
    };
    return map[text] || text;
  };

  // Mock Report Card Data
  const reportCardData = [
    { period: 1, course: "English II", teacher: "Mrs. Davis", grade: 88, absences: 1 },
    { period: 2, course: "Algebra I", teacher: "Mr. Thompson", grade: 79, absences: 2 },
    { period: 3, course: "Biology", teacher: "Ms. Garcia", grade: 92, absences: 0 },
    { period: 4, course: "World History", teacher: "Mr. Roberts", grade: 85, absences: 1 },
    { period: 5, course: "Art I", teacher: "Mrs. Wilson", grade: 98, absences: 0 },
    { period: 6, course: "PE", teacher: "Coach Miller", grade: 100, absences: 0 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      
      {/* Report Card / IEP Modal */}
      {isReportCardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <FileText size={20} />
                        <h3 className="font-bold text-lg">{t.reportCard.title}</h3>
                    </div>
                    <button onClick={() => setIsReportCardOpen(false)} className="hover:bg-blue-700 p-1 rounded transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto bg-gray-50">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                                <p className="text-gray-500">Grade {student.grade} • ID: {student.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800">{t.reportCard.semester}</p>
                                <button className="text-blue-600 text-sm flex items-center gap-1 justify-end mt-1 hover:underline">
                                    <Printer size={14} /> {t.reportCard.print}
                                </button>
                            </div>
                        </div>
                        
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100">
                                    <th className="pb-2 font-medium">{t.reportCard.table.period}</th>
                                    <th className="pb-2 font-medium">{t.reportCard.table.course}</th>
                                    <th className="pb-2 font-medium">{t.reportCard.table.teacher}</th>
                                    <th className="pb-2 font-medium text-center">{t.reportCard.table.absences}</th>
                                    <th className="pb-2 font-medium text-right">{t.reportCard.table.grade}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reportCardData.map((row) => (
                                    <tr key={row.period} className="group hover:bg-blue-50 transition">
                                        <td className="py-3 text-gray-400">{row.period}</td>
                                        <td className="py-3 font-bold text-gray-800">{row.course}</td>
                                        <td className="py-3 text-gray-600">{row.teacher}</td>
                                        <td className="py-3 text-center text-gray-600">{row.absences}</td>
                                        <td className={`py-3 text-right font-bold ${row.grade < 70 ? 'text-red-600' : row.grade < 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {row.grade}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Accommodations Section */}
                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                        <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <School size={18} /> {t.reportCard.accommodationsTitle}
                        </h4>
                        <ul className="list-disc list-inside text-sm text-purple-800 space-y-1 ml-2">
                            {t.reportCard.accommodationsList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.welcome} <span className="text-blue-600">{student.name}</span></h1>
            <p className="text-gray-500 text-sm">ID: {student.id} | Grade: {student.grade}</p>
        </div>
        <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'es' : 'en')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
        >
            <Globe size={18} />
            <span className="font-medium">{language === 'en' ? 'Español' : 'English'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Calendar size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{t.attendance}</p>
                <h3 className="text-2xl font-bold text-gray-900">{student.attendance}%</h3>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${student.riskScore > 50 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {student.riskScore > 50 ? <Activity size={24} /> : <CheckCircle size={24} />}
            </div>
            <div>
                <p className="text-sm text-gray-500">{t.risk}</p>
                <h3 className="text-2xl font-bold text-gray-900">{student.riskScore > 50 ? t.status.risk : t.status.track}</h3>
            </div>
        </div>

        {/* IEP / 504 Tile */}
        <div 
            onClick={() => setIsReportCardOpen(true)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-purple-300 hover:shadow-md transition group active:scale-95"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                    <FileText size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t.iep}</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition">{t.viewReport}</h3>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">Next Conference</p>
                <h3 className="text-lg font-bold text-gray-900">Nov 15, 4:00 PM</h3>
            </div>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
                <Mail size={20} />
            </button>
        </div>
      </div>

      {/* Main Chart - Full Width */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Activity size={20} className="text-orange-500"/> {t.ewis}
            </h3>
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-bold">
                <button 
                    onClick={() => setChartMode('yearly')}
                    className={`px-3 py-1.5 rounded transition ${chartMode === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                    {t.chart.yearly}
                </button>
                <button 
                    onClick={() => setChartMode('monthly')}
                    className={`px-3 py-1.5 rounded transition ${chartMode === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                    {t.chart.monthly}
                </button>
            </div>
        </div>
        
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={chartMode === 'yearly' ? student.riskHistory.yearly : student.riskHistory.monthly} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        label={{ value: t.chart.axis, angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#9ca3af'} }}
                    />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="Risk Score" 
                        stroke={chartMode === 'yearly' ? '#3b82f6' : '#f59e0b'} 
                        strokeWidth={3} 
                        dot={{ r: 6, strokeWidth: 2, fill: '#fff' }} 
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-4 italic text-center">
            {t.chart.footer}
        </p>
      </div>

      {/* Goals Row - Split 2/3 and 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Goals (2/3 Width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600"/> {t.goals}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {student.goals.map(goal => (
                    <div key={goal.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${goal.type === 'IEP/504' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {translateGoalText(goal.type)}
                            </span>
                            <span className="text-xs font-bold text-gray-400">{goal.progress}%</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{translateGoalText(goal.title)}</h4>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{translateGoalText(goal.description)}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${goal.type === 'IEP/504' ? 'bg-purple-500' : 'bg-blue-600'}`} style={{width: `${goal.progress}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Past Achievements (1/3 Width) */}
        <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl shadow-inner border border-gray-200">
            <h3 className="font-bold text-lg text-slate-700 mb-6 flex items-center gap-2">
                <History size={20} className="text-slate-500"/> {t.historic}
            </h3>
            <div className="space-y-4">
                {student.historicGoals.map(goal => (
                    <div key={goal.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm opacity-90 hover:opacity-100 transition">
                        <div className="mt-1 text-green-500 bg-green-50 p-1 rounded-full"><CheckCircle size={14} /></div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800">{translateGoalText(goal.title)}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 mb-1">{translateGoalText(goal.description)}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t.historicCompleted}: {goal.dueDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ParentView;