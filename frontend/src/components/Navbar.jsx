import React from "react";
import { CURRENT_STUDENT_EMAIL } from "../api";

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-[#e2e8f0] shadow-sm">
      <div className="w-full px-4 sm:px-8 flex items-center justify-between h-16 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab("explore")}
          className="flex items-center gap-2 cursor-pointer font-bold text-lg text-[#0d1c2e]"
        >
          <span className="w-8 h-8 rounded-lg bg-[#6d5ef8] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
            C
          </span>
          <span className="tracking-tight text-xl">CampusConnect</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-6 sm:space-x-8">
          <button
            onClick={() => setActiveTab("explore")}
            className={`font-semibold text-sm pb-1 transition-all ${
              activeTab === "explore"
                ? "text-[#5442de] border-b-2 border-[#5442de]"
                : "text-[#475569] hover:text-[#0d1c2e]"
            }`}
          >
            Explore Events
          </button>
          <button
            onClick={() => setActiveTab("my-registrations")}
            className={`font-semibold text-sm pb-1 transition-all ${
              activeTab === "my-registrations"
                ? "text-[#5442de] border-b-2 border-[#5442de]"
                : "text-[#475569] hover:text-[#0d1c2e]"
            }`}
          >
            My Registrations
          </button>
        </nav>

        {/* Student Session Context (Slide 47) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#c8c4d8]/60">
          <div className="w-6 h-6 rounded-full bg-[#6d5ef8] text-white flex items-center justify-center text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
          </div>
          <span className="text-xs font-semibold text-[#0d1c2e] hidden sm:inline">
            {CURRENT_STUDENT_EMAIL}
          </span>
        </div>
      </div>
    </header>
  );
}

