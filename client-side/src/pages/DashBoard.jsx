import React from 'react'
import { useSelector } from 'react-redux';

const DashBoard = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Dashboard</h1>
      {currentUser && (
        <div className='flex flex-col gap-4'>
          <img src={currentUser.photoURL} alt='profile' className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2'/>
          <h2 className='text-center font-bold text-xl'>{currentUser.username}</h2>
          <p className='text-center'>{currentUser.email}</p>
        </div>
      )}
    </div>
  )
}

export default DashBoard