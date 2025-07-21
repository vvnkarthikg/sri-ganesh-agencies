import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login');

  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  return (
    <div className="min-h-screen flex flex-col md:flex-row auth-gradient  pb-8">
      {/*bg-gradient-to-br from-violet-200  via-indigo-300  to-purple-400*/}
      {/* Left side */}
      <div className="md:w-[60%] flex items-center justify-center p-10 text-white ">
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome to Sri Ganesh Agencies</h1>
          <p className="text-lg w-[78%]">  Skip the calls. As distributors, we help you order from trusted brands—faster and easier online.</p>
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-[40%]  flex justify-center items-center p-8">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          {authMode === 'login' ? (
            <Login onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
