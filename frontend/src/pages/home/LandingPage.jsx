import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../extras/NavBar'
import CodeEditorPrototype from '../extras/CodeEditorPrototype'
import JoinRoomModal from '../../components/interviews/JoinRoomModal'

const LandingPage = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div
      className='min-h-screen w-full flex flex-col relative overflow-x-hidden'
    >
      {/* nav bar bhai  */}
      <div
        className=' absolute top-0 left-1/2  -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px]  rounded-full pointer-events-none -z-10 '
      > {/*ambiant glow */}
      </div>
      <NavBar onOpenJoinModal={() => setIsJoinModalOpen(true)} />


      {/* hero main wrapper */}
      <main
        className=' flex-1 flex flex-col items-center pt-16 px-6 pb-24 z-10'
      >
        {/* headinng */}
        <h1
          className=' font-display text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl'
        >
          Revolutionize<br className="hidden md:block" />
          <span
            className='bg-neon-gradient text-transparent bg-clip-text'
          >Tech Hire</span>
          {/* text sub */}
          <p
            className=' font-body  text-lg md:text-xl max-w-2xl text-gray-400 leading-relaxed mb-10'
          >
            Live coding interviews with real-time execution, video calling, and collaboration tools. Built for high-performance engineering teams.
          </p>
        </h1>

        {/* call action button */}
        <div
          className='flex flex-col items-center md:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-20'
        >
          {/* button 1 */}
          <Link to='/create-interview' className='w-full sm:w-auto bg-neon-gradient hover:opacity-90 hover:scale-[1.02] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-[0_0_32px_rgba(46,91,255,0.3)] text-center'>
            Start Interview
          </Link>

          {/* button 2 */}
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className='w-full sm:w-auto bg-[#1a1919] hover:bg-[#262626] text-white px-8 py-3.5 rounded-full font-medium transition-colors duration-300 border border-white/10 text-center cursor-pointer shadow-lg'
          >
            Join by Room ID
          </button>
        </div>

        {/* code editior */}
        <CodeEditorPrototype/>
      </main>

      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  )
}

export default LandingPage