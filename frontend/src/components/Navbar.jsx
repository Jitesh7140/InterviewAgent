import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  User,
  Settings,
  LogOut,
  PlusCircle,
  CreditCard,
  History,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import AuthModel from "./AuthModel";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const creditsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target)) {
        setIsCreditsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUser(null));
      setIsProfileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Helper to handle profile click (Open modal if no user, else open dropdown)
  const handleProfileClick = () => {
    if (!user?.userData) {
      setIsAuthModalOpen(true);
    } else {
      setIsProfileOpen(!isProfileOpen);
      setIsCreditsOpen(false);
    }
  };

  // Helper to handle credits click
  const handleCreditsClick = () => {
    if (!user?.userData) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreditsOpen(!isCreditsOpen);
      setIsProfileOpen(false);
    }
  };
 
  useEffect(() => { 
    if (user?.userData) {
      setIsAuthModalOpen(false);  
    }
  }, [user?.userData]); // Ye tab chalega jab userData ki value badlegi

  return (
    <>
      <nav className="w-full p-4 bg-gray-100 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 relative">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="bg-black p-1.5 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg tracking-tight">
                InterviewIQ.AI
              </span>
            </div>

            {/* Right Side: Controls (Back to the 2 icons format) */}
            <div className="flex items-center gap-4">
              {/* Credits Section */}
              <div className="relative" ref={creditsRef}>
                <button
                  onClick={handleCreditsClick}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all active:scale-95"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400">
                    <span className="text-[10px] font-bold text-gray-500">
                      $
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {user?.userData?.credits || 0}
                  </span>
                </button>

                {isCreditsOpen && user?.userData && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Your Balance
                    </div>
                    <div className="px-4 py-1 mb-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {user.userData.credits}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        credits left
                      </span>
                    </div>
                    <div className="border-t border-gray-50 pt-2">
                      <button
                        onClick={() => navigate("/pricing")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <PlusCircle size={16} className="text-blue-500" /> Add
                        Credits
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Section */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={handleProfileClick}
                  className="w-9 h-9 bg-black rounded-full flex items-center justify-center hover:ring-4 hover:ring-gray-100 transition-all active:scale-90"
                >
                  <span className="text-white text-sm font-medium uppercase">
                    {user?.userData?.name?.charAt(0) || <User size={18} />}
                  </span>
                </button>

                {isProfileOpen && user?.userData && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.userData.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user.userData.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/history");
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <History size={16} className="text-gray-400" />{" "}
                        Interview History
                      </button>
                    </div>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal Popup */}
      {isAuthModalOpen && (
        <AuthModel onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
