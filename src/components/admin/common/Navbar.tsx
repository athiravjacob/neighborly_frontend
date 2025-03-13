// src/components/Navbar.tsx
import React from "react";
import Logo from "./Logo";
import SearchBar from "./Searchbar";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950 shadow-sm h-16 flex items-center  justify-between px-4 z-10">
      <Logo />
      <SearchBar />
    </nav>
  );
};

export default Navbar;



