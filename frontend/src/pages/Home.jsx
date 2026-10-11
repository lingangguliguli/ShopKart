import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';


const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        
        const response = await api.get('/customers/me');
        setUser(response.data);
      } catch (error) {
        
        
        console.error('Not authenticated — redirecting to login', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {}
      <Navbar userName={user?.fullName} />

      {}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 fade-in">
        <div className="max-w-3xl mx-auto">

          {}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">{user?.fullName?.split(' ')[0]}</span> 👋
            </h1>
            <p className="mt-2 text-gray-500 text-lg">Here's your account information.</p>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
                  <p className="text-indigo-200 text-sm">ShopKart Customer</p>
                </div>
              </div>
            </div>

            {}
            <div className="px-6 sm:px-8 py-6 divide-y divide-gray-100">

              {}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-1 sm:gap-0">
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</span>
                </div>
                <span className="text-gray-900 font-medium">{user?.fullName}</span>
              </div>

              {}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-1 sm:gap-0">
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</span>
                </div>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>

              {}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-1 sm:gap-0">
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</span>
                </div>
                <span className="text-gray-900 font-medium">{user?.phone}</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;
