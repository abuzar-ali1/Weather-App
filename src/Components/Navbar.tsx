"use client";

import React, { useState } from "react";
import {
  MdOutlineLocationOn,
  MdOutlineMyLocation,
  MdWbSunny,
} from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

// only the bits of the API payload we care about
interface CityItem {
  name: string;
}

interface FindResponse {
  list: CityItem[];
}
type Props ={
  location: string
}
export default function Navbar({location}: Props) {
  const [city, setCity] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const[, setPlace] = useAtom(placeAtom);
  const[, setLoading] = useAtom(loadingCityAtom);
  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get<FindResponse>(
          `https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(
            value
          )}&appid=3f2dad944555842efaa81613814063d3`
        );
        const names = response.data.list.map((item) => item.name);
        setSuggestions(names);
        setError("");
        setShowSuggestions(true);
      } catch (err: unknown) {
        console.error("Location lookup failed:", err)
        setError("Unable to fetch location suggestions")
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError("");
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
    setError("");
  }
  function handleCurrentLocationClick() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async(position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3f2dad944555842efaa81613814063d3`
          );

          setTimeout(() => {
            setPlace(response.data.name);
            setCity(response.data.name);
            setLoading(false);
          }, 500);
          
        } catch (err: unknown) {
          console.error("Location lookup failed:", err)
          setError("Unable to fetch location suggestions")
          setLoading(false)
        }
      })
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("Location not found");
      setLoading(false);
    } else {
      setError("");
      setPlace(city);
      setTimeout(() => {
        setShowSuggestions(false)
        setLoading(false);
      }, 500);
      
    }
  }

  return (
    <>
    <nav className="shadow-sm w-screen sticky top-0 left-0 z-50 bg-white">
      <div className="h-[70px] flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdWbSunny className="text-3xl text-yellow-300 mt-1" />
        </div>

        <section className="flex items-center gap-3">
          <MdOutlineMyLocation 
            onClick={handleCurrentLocationClick}
            title="Your Current Location"
            className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-2xl" />
          <p className="text-state-900/80 text-sm">{location}</p>

          {/* search + suggestions */}
          <div className="relative hidden md:flex">
            <SearchBox
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
              onSubmit={handleSubmit}
            />
            <SuggestionBox
              error={error}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              handleSuggestionClick={handleSuggestionClick}
            />
          </div>
        </section>
      </div>
    </nav>
    <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative ">
            <SearchBox
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
              onSubmit={handleSubmit}
            />
            <SuggestionBox
              error={error}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              handleSuggestionClick={handleSuggestionClick}
            />
        </div>
    </section>
    </>
  );
}

type SuggestionBoxProps = {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
};

function SuggestionBox({
  showSuggestions,
  suggestions,
  error,
  handleSuggestionClick,
}: SuggestionBoxProps) {
  if (!showSuggestions && !error) return null;

  return (
    <ul className="mb-4 bg-white absolute border top-[44px] border-gray-300 rounded-md min-w-[230px] flex flex-col gap-1 p-2">
      {error && suggestions.length === 0 && (
        <li className="text-red-500 p-1">{error}</li>
      )}
      {suggestions.map((location, i) => (
        <li
          key={i}
          onClick={() => handleSuggestionClick(location)}
          className="cursor-pointer p-1 rounded hover:bg-gray-200"
        >
          {location}
        </li>
      ))}
    </ul>
  );
}
