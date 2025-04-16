import React from 'react';
import { useRouter } from 'next/router';

 const Header = ({ showBackButton = false, onLogout, title = "Germless Stadium" }) => {
  const router = useRouter();

  return (
    <header className="w-full h-16 bg-blue-500 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            className="border-none text-2xl cursor-pointer text-white"
            onClick={() => router.back()}
          >
            ←
          </button>
        )}
        <div className="text-2xl font-bold text-white">{title}</div>
      </div>
      <button
        className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300"
        onClick={onLogout}
      >
        Log out
      </button>
    </header>
  );
};

export default Header;