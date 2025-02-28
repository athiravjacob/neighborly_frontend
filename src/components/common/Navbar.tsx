// src/components/Navbar.tsx
import React from "react";
import Logo from "./Logo";
import SearchBar from "./Searchbar";
import LocationInput from "./LocationInput";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-violet-950 shadow-sm h-16 flex items-center justify-between px-4 z-10">
      <Logo />
      <SearchBar />
      <LocationInput />
    </nav>
  );
};

export default Navbar;



