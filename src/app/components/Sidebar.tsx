// Import necessary libraries
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Sidebar component
const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    // Add logic for menu click, such as navigating to a different page
  };

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
        <Link href="/">
          <div className="menu-container">
            <div
              className={`menu-item ${
                activeMenu === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("dashboard")}
            >
              Dashboard
            </div>
          </div>
        </Link>
      </div>

      {/* Logout */}
      <div className="logout-container">
        <div
          className="menu-item logout text-black"
          onClick={() => handleMenuClick("logout")}
        >
          Logout
        </div>
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