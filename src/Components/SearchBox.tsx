import React from 'react'
import { IoSearch } from 'react-icons/io5'

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function SearchBox(props : Props) {
  return (
    <form onSubmit={props.onSubmit} className='flex items-center justify-center relative h-10'>
        <input type="text" value={props.value} onChange={props.onChange} placeholder='Search' className='py-2 px-4 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full'/>
        <button className='py-[9px] px-4  bg-blue-500 text-white rounded-r-md focus:outline-none focus:bg-blue-600 h-full'><IoSearch/></button>       
    </form>
  )
}