'use client';

import router from 'next/router';

const ControlPage = () => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 p-4 text-white">
        <button className="border-none text-2xl cursor-pointer mr-4" onClick={() => router.back()}>←</button>
        <h2 className="text-2xl flex-grow font-bold text-white">Drone Remote Control</h2>
        <button className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300">Log out</button>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-blue-100 p-6 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          {/* Front Button */}
          <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg">
            ↑ Front
          </button>

          <div className="flex gap-20">
            {/* Left Button */}
            <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg">
              ← Left
            </button>

            {/* Right Button */}
            <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg">
            Right →
            </button>
          </div>

          {/* Down Button */}
          <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg mt-4">
            ↓ Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ControlPage;
