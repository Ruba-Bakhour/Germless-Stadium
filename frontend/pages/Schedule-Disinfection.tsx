"use client";

import React from "react";
import router from 'next/router';

const Schedule = () => {
    
  return (
    <>
      {/* Header */}
      <div className="flex items-center bg-blue-500 p-4">
        <button className="border-none text-2xl cursor-pointer mr-4" onClick={() => router.back()}        >←</button>
        <h2 className="text-2xl flex-grow font-bold text-white">
          Schedule Disinfection Process
        </h2>
        <button className="bg-white text-gray-900 px-4 py-2 rounded-md transition hover:bg-gray-300" >
          Log out
        </button>
      </div>

      {/* Main Container */}
      <div className="min-h-screen bg-blue-100 p-6 font-sans">
        <div className="flex justify-between gap-5 mt-36">
          
          {/* Date and Time Section */}
          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Date and Time</h3>
            <input
              type="text"
              placeholder="Start time"
              className="text-gray-600 block w-full p-2 mb-3 border border-gray-400 rounded"
            />
            <input
              type="text"
              placeholder="End time"
              className="text-gray-600 block w-full p-2 mb-3 border border-gray-400 rounded"
            />
            <input
              type="date"
              className="text-gray-600 block w-full p-2 mb-3 border border-gray-400 rounded"
            />
            <button className="w-full bg-black text-white p-2 rounded cursor-pointer">
              Schedule
            </button>
          </div>

          {/* Route Specification Section */}
          <div className="w-1/2 p-5 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-gray-600 mb-3 font-semibold">Route Specification</h3>
            <label className="block w-full cursor-pointer">
              <input type="file" className="hidden" />
              <div className="text-gray-600 w-full h-36 bg-gray-200 flex justify-center items-center rounded-lg border-2 border-dashed border-gray-400 text-gray-600 transition hover:bg-gray-300">
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
