import React from 'react';
import { UserRole } from '../types';
import { Users, GraduationCap, Baby, School, Building, Presentation } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, setRole }) => {
  const roles = [
    { id: UserRole.STUDENT, label: 'Student', icon: GraduationCap },
    { id: UserRole.PARENT, label: 'Parent', icon: Baby },
    { id: UserRole.TEACHER, label: 'Teacher', icon: Users },
    { id: UserRole.PRINCIPAL, label: 'Campus Leader', icon: School },
    { id: UserRole.ADMIN, label: 'District Admin', icon: Building },
    { id: UserRole.BOARD, label: 'Board Member', icon: Presentation },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-2xl rounded-full p-2 flex space-x-2 z-50 border border-gray-200 overflow-x-auto max-w-[90vw]">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => setRole(role.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            currentRole === role.id
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <role.icon size={16} />
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">{role.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;