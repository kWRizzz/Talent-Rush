import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiList } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/create-interview', label: 'Create Interview', icon: FiPlusCircle },
    { to: '/my-interviews', label: 'My Interviews', icon: FiList },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0e0e0e] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-2">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_16px_rgba(46,91,255,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 text-primary" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-[#131313] border border-white/5 text-xs text-gray-400">
        <p className="font-semibold text-white mb-1 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
          Live Studio
        </p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Integrated LeetCode testing, WebRTC calling, and collaborative Monaco editing.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;