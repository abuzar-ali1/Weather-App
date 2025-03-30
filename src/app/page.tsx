"use client";
import Container from "@/Components/Container";
import WeatherDetails from "@/Components/WeatherDetails";
import Navbar from "@/Components/Navbar";
import WeatherIcon from "@/Components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useState } from "react";
import { metersToKm } from "@/utils/metersToKm";

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
  const [searchValue, setSearchValue] = useState("");

  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast?q=khairpur,Pakistan&appid=3f2dad944555842efaa81613814063d3&units=metric"
      );

      return data;
    },
  });

  
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
      <div className="d-flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
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

        <section className="flex flex-col gap-4">
          <p className="text-2xl">Forecast (7 days)</p>
        </section>
      </main>
    </div>
  );
}
