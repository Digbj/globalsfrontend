import React, { useState } from "react";
import { formSchema } from "../assets/formSchema/form.js";
import axios from "axios";
import { useMyContext } from "../../context/appContext.jsx";
import { useNavigate } from "react-router-dom";
const encodeFormData = (data) => {
  const jsonStr = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(jsonStr)));
};

const DynamicForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { userDetails } = useMyContext();
  const id = userDetails ? userDetails.id : null;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const updateField = (fieldName, fieldValue) => {
    setUserData((prevData) => ({ ...prevData, [fieldName]: fieldValue }));
    if (validationErrors[fieldName]) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    }
  };

  const processFileUpload = (fieldName, uploadedFile) => {
    if (!uploadedFile) return;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setUserData((prevData) => ({
        ...prevData,
        [fieldName]: fileReader.result,
      }));
      setImagePreview(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
  };

  const checkFormValidity = () => {
    const errorList = {};

    formSchema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.conditional) {
          const { field: dependentField, value: expectedValue } =
            field.conditional;
          if (userData[dependentField] !== expectedValue) return;
        }

        const fieldValue = userData[field.id];

        if (field.required) {
          if (field.type === "multiselect") {
            if (!fieldValue || fieldValue.length === 0) {
              errorList[field.id] = `Please select at least one ${field.label}`;
            }
          } else if (!fieldValue) {
            errorList[field.id] = `${field.label} cannot be empty`;
          }
        }

        if (field.type === "email" && fieldValue) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(fieldValue)) {
            errorList[field.id] = "Please enter a valid email address";
          }
        }

        if (field.pattern && fieldValue) {
          const regex = new RegExp(field.pattern);
          if (!regex.test(fieldValue)) {
            errorList[field.id] = `${field.label} format is incorrect`;
          }
        }
      });
    });

    setValidationErrors(errorList);
    return Object.keys(errorList).length === 0;
  };

  const submitFormData = async () => {
    try {
      if (!id) {
        alert("Please login to submit the form");
        return;
      }

      if (!checkFormValidity()) {
        alert("Please fill all required fields correctly");
        return;
      }
      const formDataWithUser = {
        ...userData,
        userId: id,
      };

      const encodedData = encodeFormData(formDataWithUser);
      const response = await axios.post(
        `${backendUrl}/api/form/submit`,
        {
          encodedData: encodedData,
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201 && response.data) {
        alert("Form submitted successfully!");
        setUserData({});
        setImagePreview(null);
        setValidationErrors({});
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        console.error("Server error:", error.response.data);
        console.error(
          `Failed to submit form: ${error.response.data.msg || "Server error"}`
        );
      } else if (error.request) {
        console.error("No response from server. Please check your connection.");
      } else {
        console.error("Failed to submit form!");
      }
    }
  };

  const getInputStyle = (fieldName) => {
    const baseStyle =
      "w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorStyle = validationErrors[fieldName]
      ? "border-red-500"
      : "border-gray-300";
    return `${baseStyle} ${errorStyle}`;
  };

  const renderField = (field) => {
    if (
      field.conditional &&
      userData[field.conditional.field] !== field.conditional.value
    ) {
      return null;
    }

    const commonLabel = (
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </label>
    );

    const errorMessage = validationErrors[field.id] && (
      <p className="text-red-500 text-xs mt-1">{validationErrors[field.id]}</p>
    );

    switch (field.type) {
      case "dropdown":
        return (
          <div key={field.id}>
            {commonLabel}
            <select
              value={userData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className={getInputStyle(field.id)}
            >
              <option value="">-- Select --</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errorMessage}
          </div>
        );

      case "multiselect":
        return (
          <div key={field.id} className="sm:col-span-2">
            {commonLabel}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {field.options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(userData[field.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = userData[field.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((val) => val !== option);
                      updateField(field.id, newValues);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {errorMessage}
          </div>
        );

      case "radio":
        return (
          <div key={field.id}>
            {commonLabel}
            <div className="space-y-2">
              {field.options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={userData[field.id] === option}
                    onChange={(e) => updateField(field.id, e.target.value)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {errorMessage}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="sm:col-span-2">
            {commonLabel}
            <textarea
              value={userData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className={getInputStyle(field.id)}
              rows={3}
              placeholder="Enter details here"
            />
            {errorMessage}
          </div>
        );

      default:
        return (
          <div key={field.id}>
            {commonLabel}
            <input
              type={field.type}
              value={userData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className={getInputStyle(field.id)}
            />
            {errorMessage}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Application Form
        </h1>

        {formSchema.sections.map((section, sectionIndex) => {
          if (section.id === "upload") {
            return (
              <div key={section.id} className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {section.title}
                  <hr />
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full h-56 flex items-center justify-center mb-3">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No image uploaded
                        </span>
                      )}
                    </div>
                    <label className="w-full px-4 py-2 bg-blue-500 text-white text-center rounded-lg cursor-pointer hover:bg-blue-600 transition">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          processFileUpload("photo", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col justify-center gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Place <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={userData.place || ""}
                        onChange={(e) => updateField("place", e.target.value)}
                        className={getInputStyle("place")}
                      />
                      {validationErrors.place && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.place}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={userData.submissionDate || ""}
                        onChange={(e) =>
                          updateField("submissionDate", e.target.value)
                        }
                        className={getInputStyle("submissionDate")}
                      />
                      {validationErrors.submissionDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.submissionDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={section.id} className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {section.title}
                <hr />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map((field) => renderField(field))}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center mt-6">
          <button
            onClick={submitFormData}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:cursor-pointer"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
