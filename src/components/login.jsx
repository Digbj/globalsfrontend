import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../context/appContext";
export const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {setUserDetails} = useMyContext();
  const [loginCred, setLoginCred] = useState({
    email: "",
    password: "",
  });
 const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = loginCred;

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Min 6 characters required.");
      return;
    }
    // console.log(`${backendUrl}/api/user/login`);
    try {
       const response = await axios.post(`${backendUrl}/api/user/login`, {
         email: loginCred.email,password: loginCred.password,
       });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserDetails(user);
      navigate("/dashboard");


    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

  };

  return (
    <div className=" flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full p-2 space-y-5">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <div className="space-y-1 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={loginCred.email}
            onChange={(e) =>
              setLoginCred({ ...loginCred, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={loginCred.password}
            onChange={(e) =>
              setLoginCred({ ...loginCred, password: e.target.value })
            }
          />
        </div>

         <div className="h-1">{error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}</div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300 hover:cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};
