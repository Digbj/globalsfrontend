import { AuthModal } from "./authContainer";
import { useMyContext } from "../../context/appContext";

export const Home = () => {
  const { modelOpen, setModelOpen } = useMyContext();
    const HandleModel = () => {
        setModelOpen(!modelOpen);
        // navigate("/login");
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        Welcome to Our Application
      </h1>
      <p className="text-base sm:text-lg text-gray-600 text-center max-w-md px-4">
        This is the home page. Login to navigate more.
      </p>
      <button
        onClick={HandleModel}
        className="mt-4 px-4 sm:px-6 bg-blue-500 text-white py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300 hover:cursor-pointer"
      >
        Get Started
      </button>
      {modelOpen && <AuthModal />}
    </div>
  );
};

export default Home;
