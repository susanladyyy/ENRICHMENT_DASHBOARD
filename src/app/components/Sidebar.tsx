"use client";
// Import necessary libraries
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";

// Sidebar component
const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [activeMenu, setActiveMenu] = useState("");

  const handleMenuClick = async (menu) => {
    console.log(menu);
    setActiveMenu(menu);

    // Add logic for menu click
    if (menu === "logout") {
      // Sign out and redirect to the login page without reloading
      await signOut().then(() => {
        router.replace("/");
      });
    } else {
      // Handle other menu items
    }
  };

  useEffect(() => {
    if (pathName === "/dashboard") {
      setActiveMenu("dashboard");
    } else if (pathName === "/student_list") {
      setActiveMenu("student_list");
    }
  }, []);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo-container pl-5">
        <Image
          src="/binus.svg"
          alt="Binus Logo"
          width={200}
          height={32}
          priority
        />
      </div>

      {/* Menu items */}
      <div className="py-[3vh]">
        <Link href="/dashboard">
          <div className="menu-container">
            <div
              className={`menu-item ${
                activeMenu === "dashboard" ? "active" : ""
              }`}
            >
              Dashboard
            </div>
          </div>
        </Link>
      </div>

      <div>
        <Link href="/student_list">
          <div className="menu-container">
            <div
              className={`menu-item ${
                activeMenu === "student_list" ? "active" : ""
              }`}
            >
              Student List
            </div>
          </div>
        </Link>
      </div>

      {/* Logout */}
      <div className="logout-container">
        <Link href="/">
          <div
            className="menu-item logout"
            onClick={() => handleMenuClick("logout")}
          >
            Logout
          </div>
        </Link>
      </div>

      {/* Add styles for the sidebar */}
      <style jsx>{`
        .sidebar {
          height: 100vh;
          color: white;
          padding-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .logo-container {
          margin-bottom: 20px;
        }

        .menu-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          color: black;
          padding: 10px 15px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .menu-item:hover {
          background-color: #69bcea;
          color: white;
        }

        .menu-item.active {
          background-color: #079bde;
          color: white;
          font-weight: bold;
        }

        .logout-container {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
