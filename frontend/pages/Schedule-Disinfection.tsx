"use client";

import React, { useState } from "react";
import router from 'next/router';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from './Header';

const Schedule = () => {
  const supabase = createClientComponentClient();

  const [startTime, setStartTime] = useState("");
  const [date, setDate] = useState("");
  const [section, setSection] = useState("");
  const [battery, setBattery] = useState("");
  const [auto, setAuto] = useState(false);
  const [message, setMessage] = useState("");

  const handleSchedule = async () => {
    console.log("Schedule button clicked");

    if (!startTime || !date || !section || !battery) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const { error } = await supabase.from("schedule").insert([
        {
          Date: date,
          StartTime: startTime,
          Section: section,
          Battery: battery,
          Auto: auto,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        setMessage("Failed to schedule. Please try again.");
      } else {
        console.log("Inserted successfully");
        setMessage("Scheduled successfully!");
        setStartTime("");
        setDate("");
        setSection("");
        setBattery("");
        setAuto(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      {/* Header */}
      <Header showBackButton={true} title="Schedule Disinfection" />

      {/* Main Container */}
      <div className="min-h-screen bg-blue-100 p-6 font-sans">
        <div className="flex justify-between gap-5 mt-32">
          {/* Date and Time Section */}
          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Date and Time</h3>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-gray-600 block w-full p-2 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-gray-600 block w-full p-2 mb-3 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="text-gray-600 block w-full p-2 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Battery</label>
              <input
                type="text"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                className="text-gray-600 block w-full p-2 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Auto</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={auto}
                  onChange={() => setAuto(!auto)}
                  className="mr-2 w-5 h-5"
                />
                <span className="text-gray-600">{auto ? "Enabled" : "Disabled"}</span>
              </div>
            </div>

            <button
              onClick={handleSchedule}
              className="w-full bg-black text-white p-2 rounded cursor-pointer"
            >
              Schedule
            </button>

            {message && <p className="text-sm mt-2 text-center text-red-600">{message}</p>}
          </div>

          {/* Route Specification Section */}
          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Stadium Areas</h3>
            <label className="block w-full cursor-pointer">
              <input type="file" className="hidden" />
              <div className="text-gray-600 w-full h-80 bg-gray-200 flex justify-center items-center rounded-lg border-2 border-dashed border-gray-400 text-gray-600 transition hover:bg-gray-300">
                📷 Click to upload an image
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
