import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import bellIcon from "../assets/bell-icon.svg";
import dp from "../assets/DP.svg";
import { IoIosArrowDown } from "react-icons/io";
import { supabase } from "../supabaseClient"; // Import supabase for logout

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Sign the user out
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex justify-end items-center gap-4 h-12">
      <img
        src={bellIcon}
        alt="Bell Icon"
        className="bg-white rounded-md shadow-md cursor-pointer h-full w-12 p-2"
      />

      <div ref={profileRef} className="relative h-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white rounded-md flex items-center gap-6 shadow-md cursor-pointer py-1 px-3"
        >
          <div className="flex items-center gap-2">
            <img src={dp} alt="Display picture" className="h-8 w-8" />
            <div>
              <h1 className="font-semibold text-sm">John Doe</h1>
              <p className="text-sm">Distributor</p>
            </div>
          </div>
          <IoIosArrowDown className="text-[var(--primary-text)] text-xl" />
        </div>

        {isOpen && (
          <div className="absolute bg-white shadow-lg mt-1 flex flex-col gap-2 w-full p-3 rounded-sm">
            <button className="bg-[var(--main-bg)] text-[var(--primary-text)] py-2 font-semibold cursor-pointer">
              Edit Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout} // Trigger logout when clicked
              className="bg-[var(--main-bg)] text-[var(--primary-text)] py-2 font-semibold cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
