import React, { useState } from 'react';
import { MOCK_STUDENT } from '../constants';
import { Globe, TrendingUp, AlertTriangle, CheckCircle, Calendar, Mail } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ParentView: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const student = MOCK_STUDENT;

  const translations = {
    en: {
      welcome: "Welcome, Parent of",
      overview: "Academic Overview",
      attendance: "Attendance Rate",
      risk: "On Track Status",
      grades: "Grade Trends",
      goals: "Active Goals",
      contact: "Contact Teacher",
      status: {
        track: "On Track",
        risk: "Needs Attention"
      }
    },
    es: {
      welcome: "Bienvenido, Padre de",
      overview: "Resumen Académico",
      attendance: "Tasa de Asistencia",
      risk: "Estado de Progreso",
      grades: "Tendencias de Calificaciones",
      goals: "Metas Activas",
      contact: "Contactar Maestro",
      status: {
        track: "En Camino",
        risk: "Necesita Atención"
      }
    }
  };

  const t = translations[language];

  const gradeData = [
    { month: 'Aug', math: 78, reading: 82 },
    { month: 'Sep', math: 82, reading: 80 },
    { month: 'Oct', math: 85, reading: 88 },
    { month: 'Nov', math: 84, reading: 89 },
    { month: 'Dec', math: 88, reading: 91 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {student.riskScore > 50 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
            </div>
            <div>
                <p className="text-sm text-gray-500">{t.risk}</p>
                <h3 className="text-2xl font-bold text-gray-900">{student.riskScore > 50 ? t.status.risk : t.status.track}</h3>
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

      {/* Charts & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600"/> {t.grades}
                </h3>
                <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Math</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Reading</span>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gradeData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                        <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
                        <Line type="monotone" dataKey="reading" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Goals List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">{t.goals}</h3>
            <div className="space-y-4">
                {student.goals.map(goal => (
                    <div key={goal.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">{goal.title}</h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{goal.type}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{goal.description}</p>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${goal.progress}%`}}></div>
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
