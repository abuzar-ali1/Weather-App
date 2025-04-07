"use client";
import Container from "@/Components/Container";
import WeatherDetails from "@/Components/WeatherDetails";
import Navbar from "@/Components/Navbar";
import WeatherIcon from "@/Components/WeatherIcon";
import ForecastWeatherDetails from "@/Components/ForecastWeatherDetails";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { metersToKm } from "@/utils/metersToKm";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { loadingCityAtom, placeAtom } from "./atom";

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: CityInfo;
};

type WeatherEntry = {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
};

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Sys = {
  pod: string;
};

type CityInfo = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export default function Home() {
    const[place,] = useAtom(placeAtom);
    const[loading, ] = useAtom(loadingCityAtom);
    

  const { isPending, data , refetch } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=3f2dad944555842efaa81613814063d3&units=metric`
      );

      return data;
    },
  });

  useEffect(() => {    
  refetch();   
  }, [place , refetch]);
  
// Create a unique array of dates (in "YYYY-MM-DD" format)
  const uniqueDates = [
    ...new Set(
      data?.list.map((entry) =>
        new Date(entry.dt * 1000).toISOString().split("T")[0]
      ) || []
    ),
  ];
  const firstDataForEachDate = uniqueDates.map((date)=>{ 
    return data?.list.find((entry)=>{
      const entryDate =  new Date(entry.dt * 1000).toISOString().split('T')[0]
      const entryTime =  new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6
    })
  })
  
  const date = data?.list[0]?.dt_txt
    ? new Date(data?.list[0].dt_txt)
    : new Date();
  const formattedDate = date.toISOString().split("T")[0];
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
    
    return (
      <div className="flex flex-col items-center gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name ?? ""}/>
      
      <main className="px-3 max-w-7xl max-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {loading ? (<SkeletonWeather/>): 
       ( <>
        <section className="space-y-4">
          <div className="space-y-2">
            {/* Today data and day */}
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="">{dayOfWeek}</p>
              <p className="text-lg">({formattedDate})</p>
            </h2>
            <Container className="flex gap-10 px-6 items-center">
              {/* Temprature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {Math.floor(data?.list[0].main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>{Math.floor(data?.list[0].main.feels_like ?? 0)}°</span>
                </p>
                <p className="text-sx space-x-2">
                  <span>{Math.floor(data?.list[0].main.temp_min ?? 0)}°↓</span>
                  <span>{Math.floor(data?.list[0].main.temp_max ?? 0)}°↑</span>
                </p>
              </div>
              {/* time and weather */}
              <div className="flex flex-nowrap gap-10 sm:gap-16 overflow-x-auto w-full px-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 text-xs items-center font-semibold min-w-[60px]"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d?.dt_txt), "h:mm a")}
                    </p>
                    <WeatherIcon
                      iconname={getDayOrNightIcon(d?.weather[0].icon, d.dt_txt)}
                    />
                    <p className="whitespace-nowrap">{d?.main.temp}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/*left  */}
            <Container className="w-fit px-4 flex-col justify-center items-center">
              <p className="capitalize text-center h-fit">
                {data?.list[0]?.weather[0].description}
              </p>
              <WeatherIcon
                iconname={getDayOrNightIcon(
                  data?.list[0].weather[0].icon ?? "",
                  data?.list[0].dt_txt ?? ""
                )}
              />
            </Container>

            {/* right */}
            <Container className="bg-yellow-300/80 px-6  flex gap-4  justify-between overflow-x-auto">
              <WeatherDetails
                visability={metersToKm(data?.list[0]?.visibility ?? 1000)}
                airPressure={`${data?.list[0]?.main.pressure} hpa`}
                humidity={`${data?.list[0]?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 107325628), "h:mm a")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1093772822), "h:mm a")}
                windSpeed={`${data?.list[0]?.wind.speed} km/h`}
              />
            </Container>
          </div>
        </section>
        {/* 7 day forecast data */}

        <section className="flex  w-full flex-col gap-4">
          <p className="text-2xl">Forecast (7 days)</p>
        {firstDataForEachDate.map((d,i)=>(
                    <ForecastWeatherDetails 
                    key={i} 
                    description={d?.weather[0].description ?? ""}
                    weatherIcon={d?.weather[0].icon ?? "01d"}
                    date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                    day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                    feels_like={Math.floor(d?.main.feels_like ?? 0)}
                    temp={Math.floor(d?.main.temp ?? 0)}
                    min_temp={d?.main.temp_min ?? 0}
                    max_temp={Math.floor(d?.main.temp_max ?? 0)}
                    airPressure={`${d?.main.pressure} hpa`}
                    humidity={`${d?.main.humidity}%`}
                    sunrise={format(fromUnixTime(data?.city.sunrise ?? 107325628), "h:mm a")}
                    sunset={format(fromUnixTime(data?.city.sunset ?? 1093772822), "h:mm a")}
                    visability={metersToKm(d?.visibility ?? 1000)}
                    windSpeed={`${d?.wind.speed} km/h`}
                  />
            
          ))}
        </section>
          </>)}
      </main>
    </div>
  );
}


// Skeleton component
// This component is used to show a loading state while the data is being fetched


function SkeletonWeather() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* Today's Weather Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-40" />

          <div className="flex gap-10 px-6 items-center">
            <div className="flex flex-col gap-2 px-4">
              <div className="h-12 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>

            <div className="flex flex-nowrap gap-6 overflow-x-auto w-full px-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 text-xs items-center font-semibold min-w-[60px]"
                >
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  <div className="h-3 w-6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="flex gap-4">
          <div className="w-40 h-32 bg-gray-200 rounded flex flex-col justify-center items-center gap-3 px-4" />
          <div className="flex-1 h-32 bg-yellow-200/70 rounded px-6 flex items-center gap-6 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* 7 Day Forecast Skeleton */}
      <section className="flex w-full flex-col gap-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-24 bg-gray-200 rounded flex justify-between px-6 items-center"
          >
            <div className="w-20 h-6 bg-gray-300 rounded" />
            <div className="w-16 h-6 bg-gray-300 rounded" />
            <div className="w-16 h-6 bg-gray-300 rounded" />
            <div className="w-16 h-6 bg-gray-300 rounded" />
            <div className="w-16 h-6 bg-gray-300 rounded" />
          </div>
        ))}
      </section>
    </main>
  );
}


