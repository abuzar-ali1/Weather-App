"use client"; 

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type ProtectedRouteProps = {
  children: React.ReactNode; 
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const queryClient = new QueryClient();

  
  return (
    <QueryClientProvider client={queryClient}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children} 
      </body>
    </QueryClientProvider>
  );
}