
import React, { useState } from 'react';
import { UserRole } from './types';
import RoleSwitcher from './components/RoleSwitcher';
import StudentView from './components/StudentView';
import ParentView from './components/ParentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';
import BoardView from './components/BoardView';
import CampusView from './components/CampusView'; // New Import
import PilotView from './components/PilotView';
import DemoGuide from './components/DemoGuide';
import { LayoutDashboard, ChevronDown, Check, Rocket, Presentation } from 'lucide-react';

type AppVersion = 'pilot' | 'future';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [appVersion, setAppVersion] = useState<AppVersion>('pilot');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  const renderView = () => {
    if (appVersion === 'pilot') {
        return <PilotView />;
    }

    // Future Vision Logic
    switch (role) {
      case UserRole.STUDENT:
        return <StudentView />;
      case UserRole.PARENT:
        return <ParentView />;
      case UserRole.TEACHER:
        return <TeacherView />;
      case UserRole.PRINCIPAL:
        return <CampusView />; // Route Principal to Campus View
      case UserRole.ADMIN:
        return <AdminView />;
      case UserRole.BOARD:
        return <BoardView />;
      default:
        return <StudentView />;
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const selectVersion = (v: AppVersion) => {
    setAppVersion(v);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Version Selector / Logo Area */}
          <div className="relative">
            <button 
                onClick={toggleMenu}
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
                <div className={`p-1.5 rounded-lg transition-colors ${appVersion === 'future' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                    {appVersion === 'future' ? <Rocket className="text-white" size={20} /> : <LayoutDashboard className="text-white" size={20} />}
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                        ClearPath EDU
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                        {appVersion === 'future' ? 'Future Vision (Full)' : 'Pilot (MVP)'}
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="p-2 space-y-1">
                        <button 
                            onClick={() => selectVersion('pilot')}
                            className={`w-full flex items-start p-3 rounded-lg transition ${appVersion === 'pilot' ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="mt-1">
                                {appVersion === 'pilot' ? <Check size={16} className="text-indigo-600"/> : <div className="w-4" />}
                            </div>
                            <div className="ml-3 text-left">
                                <p className={`font-bold text-sm ${appVersion === 'pilot' ? 'text-indigo-700' : 'text-gray-800'}`}>Pilot (MVP)</p>
                                <p className="text-xs text-gray-500 mt-0.5">Looker Studio Dashboard & Early Warning Indicators</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => selectVersion('future')}
                            className={`w-full flex items-start p-3 rounded-lg transition ${appVersion === 'future' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="mt-1">
                                {appVersion === 'future' ? <Check size={16} className="text-blue-600"/> : <div className="w-4" />}
                            </div>
                            <div className="ml-3 text-left">
                                <p className={`font-bold text-sm ${appVersion === 'future' ? 'text-blue-700' : 'text-gray-800'}`}>Future Vision (Full)</p>
                                <p className="text-xs text-gray-500 mt-0.5">Comprehensive App, AI Integration, & Data Backpacks</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
          </div>

          {/* Right Side User Info & Demo Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end border-l border-gray-200 pl-4">
               {appVersion === 'future' ? (
                   <>
                    <span className="text-xs font-bold text-gray-400 uppercase">Current View</span>
                    <span className="text-sm font-medium text-gray-800">{role}</span>
                   </>
               ) : (
                   <>
                    <span className="text-xs font-bold text-gray-400 uppercase">Logged In As</span>
                    <span className="text-sm font-medium text-gray-800">District Admin</span>
                   </>
               )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appVersion === 'future' ? role : 'admin'}`} alt="Avatar" className="w-full h-full" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Role Switcher - ONLY VISIBLE IN FUTURE MODE */}
      {appVersion === 'future' && (
          <RoleSwitcher currentRole={role} setRole={setRole} />
      )}
      
      {/* Demo Guide Overlay */}
      <DemoGuide 
        isOpen={showDemoGuide} 
        onClose={() => setShowDemoGuide(false)} 
        role={role}
        appVersion={appVersion}
      />

      {/* Demo Watermark */}
      <div className="fixed bottom-2 right-4 text-[10px] text-gray-300 pointer-events-none z-0">
        Leander ISD Demo Build v0.2 • {appVersion === 'future' ? 'Phase 2' : 'Phase 1'}
      </div>
    </div>
  );
};

export default App;
