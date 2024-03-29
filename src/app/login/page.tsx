'use client'

import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { SubmitButton } from './submit-button';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmailType = (username: string) => {
    const regex = /^[A-Za-z][A-Za-z]*@odysseycounseling\.org$/;
    return regex.test(username);
  };

  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Checkpoint 1: Check for blank fields
    if (!username && !password) {
      setError('Please enter a username and password.');
      return;
    } else if (!username) {
      setError('Please enter a username.');
      return;
    } else if (!password) {
      setError('Please enter a password.');
      return;
    }

    // Checkpoint 2: Validate username format
    if (!validateEmailType(username)) {
      setError('Invalid email address.');
      return;
    }

    // If all checks pass, clear the error and proceed with sign-in
    setError(''); 
    // Your sign-in logic goes here...
    setIsLoggingIn(false); // Optionally hide the login form upon sign-in attempt
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-maroon">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to the HR Portal</h1>

        <Transition
          show={!isLoggingIn}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            onClick={() => setIsLoggingIn(true)}
            className="mt-4 bg-gradient-to-r from-light-maroon to-maroon text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </button>
        </Transition>

        <Transition
          show={isLoggingIn}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <form onSubmit={handleSignIn} className="mt-4 px-4 flex flex-col items-center">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-2 w-full border rounded-lg text-gray-800"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-2 w-full border rounded-lg text-gray-800"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
            <SubmitButton
              className="mt-4 w-full bg-gradient-to-r from-light-maroon to-maroon text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </SubmitButton>
          </form>
        </Transition>
      </div>
    </div>
  );
};

export default Login;
