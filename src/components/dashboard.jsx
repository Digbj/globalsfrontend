import React, { useState, useEffect } from "react";
import { FiDownload, FiUser, FiMail } from "react-icons/fi";
import { useMyContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
const UserDashboard = () => {
  const { userDetails, setUserDetails } = useMyContext();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).name
      : "",
    email: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : "",
  });

  const [formSubmissions, setFormSubmissions] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchFormSubmissions();
  }, []);

  const fetchUserData = async () => {
    try {
      //  {implementation yet to be done}
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFormSubmissions = async () => {
    try {
      // {implementaton yet to be doen}
      // dummy data
      setFormSubmissions([
        {
          id: 1,
          formName: "Application Form - Basic Information",
          submissionDate: "2024-01-15",
        },
        {
          id: 2,
          formName: "Qualification Details Form",
          submissionDate: "2024-01-20",
        },
        {
          id: 3,
          formName: "Address Verification Form",
          submissionDate: "2024-01-25",
        },
      ]);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    }
  };

  const handleDownloadPDF = async (formId, formName) => {
    try {
      //  implemnentation yet to be done
      alert(`Downloading: ${formName}.pdf`);
      console.log(`Download requested for form ID: ${formId}`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const HandleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserDetails(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-800 font-medium">
              <FiUser className="w-4 h-4" />
              <span>{userData?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FiMail className="w-4 h-4" />
              <span>{userData?.email}</span>
            </div>
          </div>

          <button
            onClick={HandleLogOut}
            className="w-full sm:w-auto bg-blue-500 px-4 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer max-w-xs"
          >
            <span className="text-blue-100 hover:underline text-sm">
              Logout
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">My Forms</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    S. No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Form Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Download Form
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formSubmissions.map((form, index) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {form.formName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                        Submitted
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleDownloadPDF(form.id, form.formName)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        <FiDownload className="w-4 h-4" />
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}

                {formSubmissions.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No forms submitted yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
          onClick={() => {
            navigate("/form");
          }}
          className="mt-6 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer max-w-xs"
        >
          <span className="text-blue-100 hover:underline text-sm">
            Fill Form
          </span>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
