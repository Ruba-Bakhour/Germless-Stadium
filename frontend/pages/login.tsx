import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import Image from 'next/image';
import DroneImage from '../assets/images/drone.png';
import bgImage from '../assets/images/bg-img.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); 

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md bg-blue-500">
        <div className="text-2xl font-bold text-white invisible">Germless Stadium</div>
      </header>

      {/* Main Content */}
      <div
        className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-64px)] px-6 bg-cover bg-center bg-black/50 bg-blend-overlay"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        {/* Left Section */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white shadow-lg rounded-xl p-16 w-[90%] max-w-2xl text-center flex flex-col md:flex-row items-center gap-10">
            <Image src={DroneImage} alt="Logo" width={300} height={200} className="w-48 h-auto" />
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
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-500"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
