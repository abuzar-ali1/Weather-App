import React from 'react'

type Props = {}

export default function Navbar({}: Props) {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
    <div className='h-[80px] flex justify-between items-center max-w-7xl px-3 mx-auto'>
        <div className='fex justify-center items-center gap-2'>
            <h2 className='text-gray-500 text-3xl'>Wheater</h2>
        </div>
    </div>
    </nav>
  )
}