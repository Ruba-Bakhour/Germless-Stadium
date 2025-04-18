import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient'; // Adjust the path if needed

const Header = ({ showBackButton = false, title = "Germless Stadium" }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
        onClick={handleLogout}
      >
        Log out
      </button>
    </header>
  );
};

export default Header;