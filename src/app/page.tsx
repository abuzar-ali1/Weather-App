"use client";
import Navbar from "@/Components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";


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
          const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Karachi,Pakistan&appid=${process.env.PUBLIC_WEATHER_API_KEY}`)

          return data
        }

    });
    
   
    if (isPending) return 'Loading...'


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };
  
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Search for:", searchValue);
      // Add your search logic here
    };

  return (
    <>
     <Navbar
        value="" // Pass an empty string or a state variable for controlled input
        onChange={handleInputChange} // Pass the change handler
        onSubmit={handleFormSubmit} // Pass the submit handler
      />

      <main className="px-3 max-w-7xl max-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              <p></p>
            </h2>
          </div>
        </section>



        <section></section>
      </main>
    </>
  );
}
