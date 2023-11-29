"use client";

import NavBar from "./components/NavBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // Trigger NextAuth.js authentication
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });
  
    // Check the authentication result
    if (result?.error) {
      console.error('Authentication failed:', result.error);
    } else {
      // Authentication successful, handle redirection or other actions
      console.log('Authentication successful:', result);
      router.push('/dashboard');
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 w-1/3 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-600">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 px-3 py-2"
              />
            </div>
            <div className="py-[2vh]">
              <button
                type="button"
                onClick={handleLogin}
                className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
