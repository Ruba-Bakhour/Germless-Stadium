'use client';

import router from 'next/router';

const ControlPage = () => {
  const moveDrone = async (direction: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/drone/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        throw new Error('Failed to move the drone');
      }

      const data = await response.json();
      console.log(`Drone moved ${direction}:`, data);
    } catch (error) {
      console.error('Error moving the drone:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-500 p-4 text-white">
        <button className="border-none text-2xl cursor-pointer mr-4" onClick={() => router.back()}>←</button>
        <h2 className="text-2xl flex-grow font-bold text-white">Drone Remote Control</h2>
        <button className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300">Log out</button>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-blue-100 p-6 font-sans flex items-center justify-center">
        <div className="flex w-full justify-around items-center gap-10">
          {/* Left side - Movement Controls */}
          <div className="flex flex-col items-center gap-10">
            <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg" onClick={() => moveDrone('forward')}>
              ↑ Front
            </button>

            <div className="flex gap-20">
              <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg" onClick={() => moveDrone('left')}>
                ← Left
              </button>
              <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg" onClick={() => moveDrone('right')}>
                Right →
              </button>
            </div>

            <button className="bg-white text-black px-8 py-4 rounded-md shadow hover:bg-gray-200 text-lg" onClick={() => moveDrone('backward')}>
              ↓ Back
            </button>
          </div>

          {/* Middle - Live Stream */}
          <div className="bg-black rounded-md overflow-hidden shadow-md">
            <img
              src="http://127.0.0.1:5000/video_feed"
              alt="Drone Livestream"
              className="w-[480px] h-[360px] object-cover border border-gray-300"
            />
          </div>

          {/* Right side - Takeoff and Land */}
          <div className="flex flex-col gap-10 items-center">
            <button className="bg-green-500 text-white px-8 py-4 rounded-md shadow hover:bg-green-600 text-lg" onClick={() => moveDrone('takeoff')}> 
              ⬆️ Takeoff
            </button> 
            <button className="bg-red-500 text-white px-8 py-4 rounded-md shadow hover:bg-red-600 text-lg" onClick={() => moveDrone('land')}>
              ⬇️ Land
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPage;

