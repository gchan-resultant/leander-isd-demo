import React, { useState } from 'react';
import { UserRole } from './types';
import RoleSwitcher from './components/RoleSwitcher';
import StudentView from './components/StudentView';
import ParentView from './components/ParentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';
import BoardView from './components/BoardView';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const renderView = () => {
    switch (role) {
      case UserRole.STUDENT:
        return <StudentView />;
      case UserRole.PARENT:
        return <ParentView />;
      case UserRole.TEACHER:
        return <TeacherView />;
      case UserRole.PRINCIPAL:
      case UserRole.ADMIN:
        return <AdminView />;
      case UserRole.BOARD:
        return <BoardView />;
      default:
        return <StudentView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <LayoutDashboard className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              ClearPath EDU
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-bold text-gray-400 uppercase">Current View</span>
               <span className="text-sm font-medium text-gray-800">{role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" className="w-full h-full" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Role Switcher for Demo */}
      <RoleSwitcher currentRole={role} setRole={setRole} />
      
      {/* Demo Watermark */}
      <div className="fixed bottom-2 right-4 text-[10px] text-gray-300 pointer-events-none z-0">
        Leander ISD Demo Build v0.1
      </div>
    </div>
  );
};

export default App;