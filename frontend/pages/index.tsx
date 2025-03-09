'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';

type User = {
  Userid: string;
  Email: string;
  FirstName: string;
  LastName: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      console.log("Checking user...");

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("Auth Error:", error?.message || "No session found");
        router.push('/login');
        return;
      }

      const { user } = data.session;

      console.log("Fetching user details from stadium_admins...");
      const { data: userData, error: userError } = await supabase
        .from('stadium_admins')
        .select('id, first_name, last_name, email') 
        .single();

      if (userError) {
        console.error("Error fetching user details:", userError.message);
        router.push('/login');
        return;
      }

      console.log("User found:", userData);
      setUser({
        Userid: userData.id,
        Email: userData.email,
        FirstName: userData.first_name,
        LastName: userData.last_name,
      });

      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      console.log("Auth State Changed:", event, session);
      if (!session) {
        router.push('/login');
      } else {
        checkUser();
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-500">
      {/* Header */}
      <header className="w-full h-16 bg-blue-500 shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Germless Stadium</div>
        {user && (
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={handleLogout}>
            Log out
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 bg-blue-100 w-full">
        {loading ? (
          <p className="text-lg text-gray-600 flex items-center justify-center min-h-[60vh]">Loading...</p>
        ) : user ? (
          <div className="w-full max-w-[1600px]">
            <h1 className="text-4xl text-gray-900 mb-12 pl-10">Hello, {user.FirstName} {user.LastName}</h1>

            {/* Buttons */}
            <div className="flex justify-start gap-24 pl-10">
              {/* Schedule Disinfection */}
              <button className="flex items-center w-[800px] h-[300px] border border-gray-300 rounded-xl shadow-lg bg-white hover:shadow-2xl transition px-10">
                <div className="w-[200px] h-[200px] flex items-center justify-center border border-gray-300 rounded-lg">
                  <svg width="100" height="100" viewBox="0 0 87 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6491 29.0869L4.23205 28.4604C11.699 8.98956 33.1374 -2.10035 54.0393 3.41345C76.3016 9.28614 89.525 31.7704 83.5746 53.6334C77.6241 75.4965 54.7532 88.4592 32.4909 82.5865C15.9614 78.2262 4.41497 64.708 2 49.086" stroke="#141B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M43.5 26.6V43L51.8 51.2" stroke="#141B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-4xl text-gray-900 ml-8" onClick={() => router.push('/Schedule-Disinfection')}>Schedule Disinfection</span>
              </button>

              {/* Display Reports */}
              <button className="flex items-center w-[800px] h-[300px] border border-gray-300 rounded-xl shadow-lg bg-white hover:shadow-2xl transition px-10">
                <div className="w-[200px] h-[200px] flex items-center justify-center border border-gray-300 rounded-lg">
                <svg width="100" height="100" viewBox="0 0 87 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.1944 0.444458C14.6422 0.444458 14.1944 0.892173 14.1944 1.44446C14.1944 1.99674 14.6422 2.44446 15.1944 2.44446H38.0695L47.322 12.4297L47.6189 12.75H48.0556H84.9722V83.8889C84.9722 84.4412 85.4199 84.8889 85.9722 84.8889C86.5245 84.8889 86.9722 84.4412 86.9722 83.8889V12.75C86.9722 11.6454 86.0768 10.75 84.9722 10.75H48.4922L39.5365 1.08509C39.158 0.676625 38.6263 0.444458 38.0695 0.444458H15.1944ZM38.9649 30.7312L39.5627 31.4167H40.4722H68.8055V99.5556H2.02777V21.1111H30.5751L38.9649 30.7312ZM31.7835 19.4538L40.4722 29.4167H69.8055C70.3578 29.4167 70.8055 29.8644 70.8055 30.4167V100.556C70.8055 101.108 70.3578 101.556 69.8055 101.556H1.02777C0.475487 101.556 0.027771 101.108 0.027771 100.556V20.1111C0.027771 19.5588 0.475486 19.1111 1.02777 19.1111H31.0298C31.3187 19.1111 31.5936 19.2361 31.7835 19.4538Z" fill="#222222"/>
                  </svg>
                </div>
                <span className="text-4xl text-gray-900 ml-8" onClick={() => router.push('/ReportPage')}>Display Disinfection Reports</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600 flex items-center justify-center min-h-[60vh]">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}