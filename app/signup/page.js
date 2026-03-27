"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  // We added new "storage boxes" for the new data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessType, setBusinessType] = useState("Retail (Traditional)");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("Submitting your application...");

    // 1. Create the secure login (Email & Password)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      setMessage("Error: " + authError.message);
      return; // Stop here if login fails
    }

    // 2. Save the Business Details into the 'profiles' table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id, // This links the profile to their secure login
            full_name: fullName,
            business_name: businessName,
            gst_number: gstNumber,
            business_type: businessType,
            role: 'Customer', // Default role
            is_approved: false // Needs Admin approval based on your plan!
          }
        ]);

      if (profileError) {
        setMessage("Profile Error: " + profileError.message);
      } else {
        setMessage("Success! Your application has been sent to Raj Gharona for approval.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Partner with Raj Gharona
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Fill out the interest form to access wholesale pricing.</p>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" required />
          
          <hr className="my-2" /> {/* Visual separator */}

          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border p-2 rounded" required />
          <input type="text" placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="border p-2 rounded" required />
          <input type="text" placeholder="GST Number (Optional)" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="border p-2 rounded" />
          
          <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="border p-2 rounded bg-white">
            <option value="Wholesale">Wholesale / Distribution</option>
            <option value="Retail (Modern Trade)">Retail (Modern Trade)</option>
            <option value="Retail (Traditional)">Retail (Traditional)</option>
            <option value="HORECA">HORECA (Hotel/Restaurant/Cafe)</option>
            <option value="Roti Factory">Roti Factory</option>
            <option value="D2C">Direct to Consumer (D2C)</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mt-2">
            Submit Application
          </button>
        </form>

        {message && <p className="mt-4 text-center font-semibold text-blue-700">{message}</p>}
      </div>
    </div>
  );
}