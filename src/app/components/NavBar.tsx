"use client";
// components/navbar.tsx
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
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
        </div>
      </div>
    </nav>
  );
}
