'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import Image from 'next/image';
import DroneImage from '../assets/images/drone.png';
import bgImage from '../assets/images/bg-img.jpg'; 

<Image src={DroneImage} alt="Logo" width={300} height={200} />


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // Assuming username is actually an email
      password: password,
    });
  
    if (error) {
      alert(error.message);
      return;
    }
  
    // Fetch user details using the Supabase user ID
    const { data: userData, error: userError } = await supabase
      .from('stadium_admins')
      .select('id, first_name, last_name, username, phone_number, stadium_name')
      .eq('id', data.user.id) // Match on user_id instead of username
      .single();
  
    if (userError) {
      alert('Failed to retrieve user data.');
      console.error(userError.message);
      return;
    }
  
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md bg-blue-500">
        {/* Logo */}
        <div className="text-2xl font-bold"> 
          <span className="tracking-wider"> </span> {/* Placeholder for your logo */}
        </div>
        {/* Auth Buttons */}
        <div className="space-x-2">
          <button className="px-4 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100" onClick={() => router.push('/login')}>
            Sign In
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800" onClick={() => router.push('/register')}>
            Register
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div 
  className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-64px)] px-6bg-cover bg-center bg-black/50 bg-blend-overlay"
  style={{ backgroundImage: `url(${bgImage.src})` }}
>

  
{/* Left Section */}
<div className="flex-1 flex justify-center">
<div className="bg-white shadow-lg rounded-xl p-16 w-[90%] max-w-2xl text-center flex flex-col md:flex-row items-center gap-10">
    {/* Logo */}
    <Image src={DroneImage} alt="Logo" width={300} height={200} className="w-48 h-auto" />
    
    {/* Name & Slogan */}
    <div className="text-center md:text-left">
      <h1 className="text-6xl font-bold text-gray-900">Germless Stadium</h1>
      <p className="text-lg text-gray-600 italic mt-2">Where Cleanliness Takes Flight!</p>
    </div>
  </div>
</div>


        {/* Right Section (Login Card) */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="Enter Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
