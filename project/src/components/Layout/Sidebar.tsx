import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Calculator,
  FileText, 
  BarChart3, 
  Settings,
  Wheat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { currentRole } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['admin', 'ops-analyst']
    },
    {
      name: 'Create Estimate',
      href: '/create-estimate',
      icon: Plus,
      roles: ['admin', 'ops-analyst']
    },
    {
      name: 'Quick Estimate',
      href: '/quick-estimate',
      icon: Calculator,
      roles: ['admin', 'ops-analyst']
    },
    {
      name: 'Past Estimates',
      href: '/estimates',
      icon: FileText,
      roles: ['admin', 'ops-analyst']
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      roles: ['admin']
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['admin']
    },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentRole)
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
          <Wheat className="h-8 w-8 text-white mr-2" />
          <span className="text-xl font-bold text-white">GrainExport</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;