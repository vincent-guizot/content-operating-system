import { Outlet } from "react-router-dom";

import LeftBar from "./LeftBar";
import TopBar from "./TopBar";

export default function MainLayout() {
  return (
    <div className="flex h-screen font-mono">
      <LeftBar />

      <div className="flex flex-col flex-1">
        <TopBar />

        <main className="flex-1 overflow-auto p-6 bg-[#fdf6e3]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
