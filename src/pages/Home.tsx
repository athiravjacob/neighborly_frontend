// src/App.tsx
import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-20 pl-16 md:pl-64 transition-all duration-300">
        <div className="p-4">
          <h1 className="text-2xl text-gray-800">Welcome to Neighborly</h1>
          <p className="mt-2 text-gray-600">
No tasks available for now.Try again later          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;


