// src/App.tsx
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import MainContent from "../components/common/MainContent";


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


