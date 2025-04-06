"use client";
import React, { useState } from "react";
import {
  MdOutlineLocationOn,
  MdOutlineMyLocation,
  MdWbSunny,
} from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";

export default function Navbar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  // suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=3f2dad944555842efaa81613814063d3`
        );
        const suggestions = response.data.list.map((item: any) => item.name);
        
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }
  console.log(suggestions)
  function handleSuggestionClick(value : string){
    setCity(value)
    setShowSuggestions(false)


  }

  function handleSubmit( e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    if(suggestions.length == 0){
      setError("Location not found")
    }else{
      setError('')
      setShowSuggestions(false)
    }
  }
  return (
    <nav className="shadow-sm w-screen sticky top-0 left-0 z-50 bg-white">
      <div className="h-[70px] flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-gray-500 text-3xl">Wheater</h2>
          <MdWbSunny className="text-3xl text-yellow-300 mt-1" />
        </div>
        {/*  */}
        <section className="flex items-center gap-3">
          <MdOutlineMyLocation className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-2xl" />
          <p className="text-state-900/80 text-sm">Pakistan</p>
          {/*search bar  */}

          <div className="relative">
            <SearchBox
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
               onSubmit={handleSubmit}
            />
            <SuggesionBox 
            error={error}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}

function SuggesionBox({
  showSuggestions,
  suggestions,
  error,
  handleSuggestionClick,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
     
      {((showSuggestions && suggestions.length > 0) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] border-gray-300 rounded-md min-w-[230px] flex flex-col gap-1 p-2">


          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}

          {suggestions.map((location,i)=>(

          <li key={i} onClick={()=>handleSuggestionClick(location)} className="cursor-pointer p-1 rounded hover:bg-gray-200">
            {location}
          </li>
          ))}
        </ul>
      )}
    </>
  );
}
