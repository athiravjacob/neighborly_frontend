// src/App.tsx

import MainContent from "../../components/user/common/MainContent";
import Navbar from "../../components/user/common/Navbar";
import Sidebar from "../../components/user/common/Sidebar";



const Home: React.FC = () => {
  

  return (
    <div className="min-h-screen py-14  bg-gray-50">
      <Navbar />
      <Sidebar />
      <MainContent/>
      

      
    </div>
  );
};

export default Home;


