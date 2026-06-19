import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav
            className='w-full flex items-center justify-between px-6 py-5 md:px-12 bg-transparent text-white font-body'
        >
            {/* name */}
            <Link
                to='/'
                className='text-xl tracking-wide cursor-pointer'
            >
                <span
                    className='inline-block font-display font-bold text-2xl tracking-wide bg-neon-gradient text-transparent bg-clip-text'
                >
                    Talent-Rush
                </span>

            </Link>


            {/* links */}

            <div
                className='hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400'
            >

                {/* lik1 */}

                <Link
                    to='/features/CreateInterview'
                    className='relative hover:text-white group transition-colors  '
                >
                    Create
                    <span
                        className=' absolute -bottom-1.5 left-0  h-[1px] bg-neon-gradient rounded-full w-0 transition-all duration-300 group-hover:w-full'
                    ></span>
                </Link>
                
                {/* lik1.2 */}

                <Link
                    to='/features/MyInterviews'
                    className='relative hover:text-white group transition-colors  '
                >
                    Your Interview
                    <span
                        className=' absolute -bottom-1.5 left-0  h-[1px] bg-neon-gradient rounded-full w-0 transition-all duration-300 group-hover:w-full'
                    ></span>
                </Link>


                {/* lik2 */}

                <a
                    href='#pricing'
                    className='relative hover:text-white group transition-colors  '
                >
                    Pricing
                    <span
                        className=' absolute -bottom-1.5 left-0 w-0 h-[1px] bg-neon-gradient rounded-full transition-all duration-300 group-hover:w-full'
                    ></span>
                </a>


                {/* documentation */}

                <a
                    href="#documentation"
                    className=' relative group hover:text-white transition-colors '
                >
                    Doucumentation
                    <span
                        className=' absolute w-0 -bottom-1.5 left-0 h-[1px] bg-neon-gradient rounded-full transition-all duration-300 group-hover:w-full'
                    ></span>
                </a>
            </div>

            {/* auth */}
            <div
                className=' flex items-center space-x-5 text-sm font-medium'
            >
                {/* login */}
                <Link
                    to='/login'
                    className=' bg-neon-gradient  hover:opacity-90 px-6 py-2.5 rounded-full text-gray-300 hover:text-white transition-all  shadow-[0_0_24px_rgba(46,91,255,0.25)] flex items-center justify-center'
                >
                    LogIn
                </Link>

                {/* signin */}
                <Link
                    to='/signin'
                    className= 'bg-neon-gradient hover:opacity-90 px-6 py-2.5 rounded-full  text-gray-300 hover:text-white transition-all shadow-[0_0_24px_rgba(46,91,255,0.25)] flex items-center justify-center'
                >
                    SignIn
                </Link>
            </div>
        </nav>
    )
}

export default NavBar