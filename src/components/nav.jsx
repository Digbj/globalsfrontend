import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { IoMoonSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../context/appContext";
export const NavBar = () => {
  const navigate = useNavigate();
  const { setModelOpen, userDetails } = useMyContext();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  const HandleHome = () => {
    setModelOpen(false);
    navigate("/");
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <button
              className={`${
                isDark
                  ? "text-white hover:text-gray-300"
                  : "text-gray-800 hover:text-gray-600"
              } text-lg font-semibold px-4 py-2 rounded transition-colors hover:cursor-pointer`}
              onClick={HandleHome}
            >
              Home
            </button>
          </div>
          <div className="flex flex-row gap-4 items-center justify-center">
            {userDetails && (
              <div onClick={() => navigate("/dashboard")}>
                <p className="m-0 font-medium text-blue-500 hover:cursor-pointer">
                  Dashboard
                </p>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className={`${
                isDark
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } p-2 rounded-full transition-all duration-300`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={20} /> : <IoMoonSharp size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
