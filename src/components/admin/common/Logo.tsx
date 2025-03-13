import React from "react";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="text-white font-bold text-2xl cursor-pointer hover:text-white transition-colors" onClick={()=>navigate("/home")}>
     Neighborly
    </div>
  );
};

export default Logo;