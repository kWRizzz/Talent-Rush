import React from 'react'
import{
  Link
}from "react-router-dom"
const Sidebar = () => {
  return (
    <div
      className='w-64 border-b border-zinc-700 p-4'
    >
      <div
        className=' flex flex-col gap-3'
      >
        <Link
          to={"/dashboard"}
        >
          DashBoard
        </Link>

        <Link
          to={`/interview`}
        >
          Create Interview
        </Link>

        <Link
          to={"/my-interview"}
        >
          My Interview
        </Link>
      </div>

    </div>
  )
}

export default Sidebar