import Image from 'next/image'
import React from 'react'



export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & {iconname: string}) {
  console.log(props.iconname)
  return (
    <div {...props} className='relative h-20 w-20 '>
        <Image width={100} height={100} className='absolute h-full w-full' alt='Weather-Icon' src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}/>
    </div>
  )
}