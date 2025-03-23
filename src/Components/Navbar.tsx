import React from 'react'
import { IoSearch } from 'react-icons/io5'
import { MdOutlineLocationOn, MdOutlineMyLocation, MdWbSunny } from 'react-icons/md'

type Props = {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function Navbar(props: Props) {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
    <div className='h-[70px] flex justify-between items-center max-w-7xl px-3 mx-auto'>
        <div className='flex justify-center items-center gap-2'>
            <h2 className='text-gray-500 text-3xl'>Wheater</h2>
            <MdWbSunny className='text-3xl text-yellow-300 mt-1' />
        </div>
        {/*  */}
        <section className='flex items-center gap-3'>
        <MdOutlineMyLocation  className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
        <MdOutlineLocationOn className='text-2xl'/> 
        <p className='text-state-900/80 text-sm'>Pakistan</p>
          {/*search bar  */}
            <form onSubmit={props.onSubmit} className='flex items-center justify-center relative h-10'>
                <input type="text" value={props.value} onChange={props.onChange} placeholder='Search' className='py-2 px-4 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full'/>
                <button className='py-[9px] px-4  bg-blue-500 text-white rounded-r-md focus:outline-none focus:bg-blue-600 h-full'><IoSearch/></button>       
            </form>
        </section>
    </div>
    </nav>
  )
}