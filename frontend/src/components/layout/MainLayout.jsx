import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div
      className='min-h-screen bg-zinc-900 text-white'
    >
      <Navbar />
      <div
        className='flex'
      >
        <Sidebar />

        <div
          className='flex-1 p-6'
        >
          {children}
        </div>

      </div>
    </div>
  )
}



export default MainLayout