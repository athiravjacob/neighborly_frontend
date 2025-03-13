import { Outlet } from "react-router-dom";

const MainContent = () => {
   
  return (
    <main className="flex-1   overflow-auto ml-24   md:ml-72">
      <Outlet />
    </main>
  );
}

export default MainContent