import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails from './WeatherDetails'

export interface ForecastWeatherDetailsProps extends WeatherDetails {
  weatherIcon: string;
  date: string;
  day: string;
  description: string;
  temp: number;
  feels_like: number;
  min_temp: number;
  max_temp: number;
}

export default function ForecastWeatherDetails(props: ForecastWeatherDetailsProps) {
  const {
    weatherIcon = "10d",
    date = "2023-10-10",
    day = "Monday",
    description = "Clear Sky",
    temp = 25,
    feels_like = 27,
    min_temp = 20,
    max_temp = 30,
  } = props;

  return (
    <Container className="gap-4">
      {/* Left Section */}
      <section className="flex items-center px-4 gap-4">
        <div  className='flex flex-col gap-1 items-center'>
          <WeatherIcon iconname={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-5xl">{temp}</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels Like</span>
            <span>{feels_like}</span>
          </p>
          <p className="capitalize">{description}</p>
        </div>
      </section>
      {/* Right Section */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  )
}
