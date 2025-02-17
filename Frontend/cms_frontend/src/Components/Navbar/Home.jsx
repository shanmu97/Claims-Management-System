import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600"
      style={{ backgroundImage: "url('home-background.jpg')" }}
    >
      {/* Main Content */}
      <div
        style={{
          position: "absolute",
          top: 100,
        }}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg text-center relative z-10 transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Claims Management System</h1>
        <p className="text-gray-600 text-lg">
          Manage your insurance claims efficiently. Submit, track, and manage claims with ease.
        </p>
        <blockquote className="mt-6 text-gray-700 italic">
          "Insurance is the anchor that keeps you steady in the stormy seas of life."  
          <span className="block mt-2 text-sm font-semibold">– Lumiq</span>
        </blockquote>
        <div className="mt-6">
          <Link to="/policies" className="bg-red-700 hover:bg-red-800 transition-all duration-300 text-white px-6 py-2 rounded-lg shadow-md">
            Our Policies
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
