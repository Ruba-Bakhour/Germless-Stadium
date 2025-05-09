"use client";

import React, { useState } from "react";
import router from 'next/router';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from './Header';
import blueprint from '../assets/images/Blueprint.png';

const sectionOptions = ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const Schedule = () => {
  const supabase = createClientComponentClient();

  const [startTime, setStartTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [battery, setBattery] = useState("");
  const [auto, setAuto] = useState(false);
  const [message, setMessage] = useState("");

  const handleSectionChange = (section: string) => {
    if (section === "All") {
      if (selectedSections.includes("All")) {
        setSelectedSections([]);
      } else {
        setSelectedSections(sectionOptions);
      }
    } else {
      const updatedSections = selectedSections.includes(section)
        ? selectedSections.filter((s) => s !== section)
        : [...selectedSections, section];
      if (updatedSections.length === sectionOptions.length - 1 && !updatedSections.includes("All")) {
        updatedSections.push("All");
      }
      if (updatedSections.includes("All") && updatedSections.length < sectionOptions.length) {
        updatedSections.splice(updatedSections.indexOf("All"), 1);
      }
      setSelectedSections(updatedSections);
    }
  };

  const handleSchedule = async () => {
    if (!startTime || !date || selectedSections.length === 0 || !battery) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase.from("schedule").insert([{
        Date: date,
        StartTime: startTime,
        Section: selectedSections.join(", "),
        Battery: battery,
        Auto: auto,
      }]);
      if (error) {
        console.error("Supabase insert error:", error);
        setMessage("Failed to schedule. Please try again.");
      } else {
        setMessage("Scheduled successfully!");
        setStartTime("");
        setDate("");
        setSelectedSections([]);
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
      <Header showBackButton={true} title="Schedule Disinfection" />

      <div className="min-h-screen bg-blue-100 p-6 font-sans">
        <div className="flex justify-between gap-5 mt-10">

          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Date and Time</h3>

            <div className="mb-3">
              <label htmlFor="start-time" className="text-sm text-gray-500 mb-1 block">Start time</label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-gray-600 block w-full p-2 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="schedule-date" className="text-sm text-gray-500 mb-1 block">Date</label>
              <input
                id="schedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-gray-600 block w-full p-2 mb-3 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Section</label>
              <div className="grid grid-cols-3 gap-2">
                {sectionOptions.map((section, idx) => {
                  const checkboxId = `section-${idx}`;
                  return (
                    <div key={section} className="flex items-center">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={selectedSections.includes(section)}
                        onChange={() => handleSectionChange(section)}
                        className="mr-2"
                      />
                      <label htmlFor={checkboxId} className="text-gray-600">{section}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="battery-input" className="text-sm text-gray-500 mb-1 block">Battery</label>
              <input
                id="battery-input"
                type="text"
                value={battery}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    setBattery(input);
                    setMessage("");
                  } else {
                    setMessage("Please enter numbers only for the battery.");
                  }
                }}
                className="text-gray-600 block w-full p-2 border border-gray-400 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500 mb-1 block">Automated Cleaning</label>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    id="auto-enabled"
                    type="radio"
                    name="automated-cleaning"
                    value="enabled"
                    checked={auto === true}
                    onChange={() => setAuto(true)}
                    className="mr-2 w-5 h-5"
                  />
                  <label htmlFor="auto-enabled" className="text-gray-600">Enabled</label>
                </div>

                <div className="flex items-center">
                  <input
                    id="auto-disabled"
                    type="radio"
                    name="automated-cleaning"
                    value="disabled"
                    checked={auto === false}
                    onChange={() => setAuto(false)}
                    className="mr-2 w-5 h-5"
                  />
                  <label htmlFor="auto-disabled" className="text-gray-600">Disabled</label>
                </div>
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

          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Stadium Areas</h3>
            <div className="block w-full">
              <img
                src={blueprint.src}
                alt="Blueprint preview"
                className="w-full h-full object-cover rounded-lg border-2 border-dashed border-gray-400"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Schedule;
