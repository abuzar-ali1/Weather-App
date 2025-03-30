import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

type Props = {}

export interface WeatherDetails{
    visability: string;
    airPressure: string;
    humidity: string;
    sunrise: string;
    sunset: string;
    windSpeed: string;
}

export default function WeatherDetails(props : WeatherDetails) {
    const {
        visability= "25km",
        airPressure= "1012 hpa",
        humidity = "61%",
        sunrise="6:00 AM",
        sunset="6:00 PM",
        windSpeed="7 km/h",
    } = props
    
  return (
    <>
    <SingleWeatherDetail
        icon ={<LuEye/>}
        inforamtion='Visability'
        value={props.visability}
    />
    <SingleWeatherDetail
        icon ={<FiDroplet/>}
        inforamtion='Humidity'
        value={props.humidity}
    />
    <SingleWeatherDetail
        icon ={<MdAir/>}
        inforamtion='Wind Speed'
        value={props.windSpeed}
    />
    <SingleWeatherDetail
        icon ={<ImMeter/>}
        inforamtion='Air Pressure'
        value={props.airPressure}
    />
    <SingleWeatherDetail
        icon ={<LuSunrise/>}
        inforamtion='Sunrise'
        value={props.sunrise}
    />
    <SingleWeatherDetail
        icon ={<LuSunset/>}
        inforamtion='Sunset'
        value={props.sunset}
    />
    </>
  )
}

export interface SingleWeatherDetailProps{
    inforamtion: string;
    icon: React.ReactNode
    value: string;

}

function SingleWeatherDetail(props: SingleWeatherDetailProps){
    return(
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.inforamtion}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}