// components/WeatherIcon.tsx

import Image from "next/image";
import React from "react";

interface WeatherIconProps extends React.HTMLProps<HTMLDivElement> {
  iconname: string;
}

export default function WeatherIcon({ iconname, ...props }: WeatherIconProps) {
  return (
    <div {...props} className="relative h-20 w-20">
      <Image
      unoptimized
        width={100}
        height={100}
        alt="Weather-Icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconname}@4x.png`}
      />
    </div>
  );
}
