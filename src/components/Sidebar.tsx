import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusSquare, 
  Upload, 
  PieChart, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Package },
    { id: 'add', label: 'Add Asset', icon: PlusSquare },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 bg-[#1e293b] text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:block shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-3 py-2.5 text-sm font-medium transition-all rounded-lg group",
                  activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3 transition-colors",
                  activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-700">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
              Database Status
            </div>
            <div className="flex items-center justify-between text-xs transition-opacity hover:opacity-100">
              <span className="text-slate-400">Supabase DB</span>
              <span className="text-green-400 font-mono">Live</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
