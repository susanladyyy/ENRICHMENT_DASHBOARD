"use client";
// components/navbar.tsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on mount

  const formattedTime = currentTime.toLocaleString("en-US", options);

  return (
    <nav className="shadow-md">
      <div className="container mx-auto pb-2">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                src="/binus.svg"
                alt="Binus Logo"
                width={200}
                height={32}
                priority
              />
            </Link>
          </div>
          <div className="flex space-x-10">
            <div suppressHydrationWarning>
              <p className="mt-2">{formattedTime}</p>
            </div>

            {/* <Link href="/">
              <Image
                src="/profile.svg"
                alt="Default Profile"
                width={35}
                height={35}
              />
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
