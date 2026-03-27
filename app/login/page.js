"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation"; // This lets us change pages automatically

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Logging in...");

    // Ask Supabase to log the user in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
    } else {
      setMessage("Success! Taking you to the store...");
      // Send them to the products page!
      router.push('/products'); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Raj Gharona Login
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Welcome back to your partner portal.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border p-2 rounded" 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-4 text-center font-semibold text-blue-700">{message}</p>}

        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
          Don't have a partner account? <br/>
          <a href="/signup" className="text-blue-600 hover:underline font-semibold">Apply Here</a>
        </div>
      </div>
    </div>
  );
}