"use client";
import Container from "@/Components/Container";
import Navbar from "@/Components/Navbar";
import convertKalvinToCal from "@/utils/convertKalvinToCal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { callbackify } from "util";


interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};



export default function Home() {
  const [searchValue, setSearchValue] = useState("");

  const { isPending, error, data } = useQuery<WeatherData>({
      queryKey: ["repoData"],
      queryFn: async () =>
        {
          const {data} = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=khairpur,Pakistan&appid=3f2dad944555842efaa81613814063d3")

          return data
        }

    });
    console.log(data)
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getDay()];

   
    if (isPending) return <div className="d-flex items-center min-h-screen justify-center">
      <p className="animate-bounce">Loading...</p>
    </div>
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };  
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Search for:", searchValue);
      // Add your search logic here
    };
   
  return (
    <div className="flex flex-col items-center gap-4 bg-gray-100 min-h-screen">
     <Navbar
        value="" // Pass an empty string or a state variable for controlled input
        onChange={handleInputChange} // Pass the change handler
        onSubmit={handleFormSubmit} // Pass the submit handler
      />

      <main className="px-3 max-w-7xl max-auto flex flex-col gap-9 w-full pb-10 pt-4">
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
              {convertKalvinToCal(data?.main.temp ?? 200)}°
              </span>
              <p className="text-xs space-x-1 whitespace-nowrap">
                <span>Feels like</span>
                <span>
                  {convertKalvinToCal(data?.main.feels_like ?? 0)}°  
                </span>
              </p>
              <p className="text-sx space-x-2">
                <span>
                  {convertKalvinToCal(data?.main.temp_min ?? 0)}°↓
                </span>
                <span>
                {convertKalvinToCal(data?.main.temp_max ?? 0)}°↑

                </span>
              </p>
            </div>
            {/* time and weather */}
            <div className="flex flex-col justify-center gap-10 sm:gap-16 overflow-x-auto w-full pr-3">
              {data?.weather.map((weather) => (
                <div key={weather.id} className="flex flex-col items-center">
                  <img
                    className="w-16 h-16"
                    src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt="weather icon"
                  />
                  <p className="text-xs">{weather.description}</p>
                </div>
              ))}
            </div>
            </Container>
          </div>
        </section>



        <section></section>
      </main>
    </div>
  );
}
