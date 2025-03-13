// src/App.tsx

import MainContent from "../../components/admin/common/MainContent";
import Navbar from "../../components/admin/common/Navbar";
import Sidebar from "../../components/admin/common/Sidebar";



const Home: React.FC = () => {
  

  return (
    <div className="min-h-screen py-14  bg-gray-800">
      <Navbar />
      <Sidebar />
      <MainContent/>
      

      
    </div>
  );
};

export default Home;


