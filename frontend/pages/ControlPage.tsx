'use client';

import router from 'next/router';
import  Header  from './Header';

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
        throw new Error('Failed to move the drone');}
      const data = await response.json();
      console.log(`Drone moved ${direction}:`, data);
    } catch (error) {
      console.error('Error moving the drone:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <Header showBackButton={true} title="Control Drone" />
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
            <button 
              className="bg-blue-500 text-white px-8 py-4 rounded-md shadow hover:bg-blue-600 text-lg" 
              onClick={() => moveDrone('disinfect')}
            >
             Disinfect
            </button>

            <button 
              className="bg-green-500 text-white px-8 py-4 rounded-md shadow hover:bg-green-600 text-lg" 
              onClick={() => moveDrone('takeoff')}
            >
              ⬆️ Takeoff
            </button> 

            <button 
              className="bg-red-500 text-white px-8 py-4 rounded-md shadow hover:bg-red-600 text-lg" 
              onClick={() => moveDrone('land')}
            >
              ⬇️ Land
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPage;

