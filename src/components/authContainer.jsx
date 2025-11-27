import { Login } from "./login";
import { Registration } from "./registration";
import { useMyContext } from "../../context/appContext";

export const AuthModal = () => {
  const { activeForm, setActiveForm } = useMyContext();
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <div className="w-full max-w-xs md:max-w-sm bg-white shadow-lg rounded-xl p-2">
        <div className="transition-all duration-300">
          {activeForm === "login" ? <Login /> : <Registration />}
        </div>

        <div className="text-center mt-4">
          {activeForm === "login" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-500 font-medium hover:underline hover:cursor-pointer"
                onClick={() => setActiveForm("register")}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <button
                className="text-blue-500 font-medium hover:underline hover:cursor-pointer"
                onClick={() => setActiveForm("login")}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
