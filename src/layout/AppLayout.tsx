import { Outlet } from "react-router-dom";
import MobileNavbar from "../components/MobileNavbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../hooks/useTheme";

function AppLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#141625]" : "bg-[#F8F8FB]"
      }`}
    >
      <div className="mx-auto min-h-screen lg:flex lg:max-w-360 lg:items-stretch">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <MobileNavbar />

          <main
            className={`flex-1 px-6 py-8 transition-colors duration-300 md:px-12 md:py-14 xl:px-20 ${
              isDark ? "bg-[#141625]" : "bg-[#F8F8FB]"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
