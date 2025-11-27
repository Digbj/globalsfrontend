import { useState } from "react";
import axios from "axios";
import { useMyContext } from "../../context/appContext";
export const Registration = () => {
  const { activeForm, setActiveForm } = useMyContext();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;
    if (!name) return setError("Full name is required.");
    if (!email) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    if (!confirmPassword) return setError("Please confirm your password.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Min 6 characters required.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    console.log(`${backendUrl}/api/user/signup`);
    try {
      const response = await axios.post(`${backendUrl}/api/user/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 || 201) {
        setActiveForm("login");
      }
    } catch (err) {
      if (err.response?.data?.message) {
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
          Create Account
        </h2>

        <div className="space-y-0.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-0.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-0.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div className="space-y-0.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>

        <div className="h-1">
          {error && <p className="text-red-500 text-sm py-0">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300 hover:cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
};
