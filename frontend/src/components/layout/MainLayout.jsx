import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-body selection:bg-primary/40 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Ambient background glow from landing page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;