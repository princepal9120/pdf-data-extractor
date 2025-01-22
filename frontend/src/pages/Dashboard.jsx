import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({ Name: "", Phone: "", Address: "", Role: "", Email: "" });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("Something went wrong while uploading the file!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData({ Name: "", Phone: "", Address: "", Role: "", Email: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-indigo-700 text-center mb-6">PDF Data Extractor</h1>
        
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="fileUpload"
            className="w-full flex flex-col items-center justify-center p-4 bg-indigo-50 border border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-100 transition"
          >
            <svg
              className="w-12 h-12 text-indigo-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-4-4m0 0a4 4 0 014-4m-4 4h.01M20 16a4 4 0 004-4m0 0a4 4 0 00-4-4m4 4h-.01M9 14l2-2m0 0l2-2m-2 2v6"
              />
            </svg>
            <p className="text-indigo-600">Click to upload a PDF</p>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-indigo-600">Selected: {file.name}</p>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload and Extract"}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-md shadow hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>

        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="loader w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {data.Name && (
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Extracted Data:</h3>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium">Name:</label>
                <span className="text-gray-700">{data.Name}</span>
              </div>

              {/* Phone Field */}
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium">Phone Number:</label>
                <span className="text-gray-700">{data.Phone}</span>
              </div>

              {/* Address Field */}
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium">Address:</label>
                <span className="text-gray-700">{data.Address}</span>
              </div>

              {/* Role Field */}
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium">Role:</label>
                <span className="text-gray-700">{data.Role}</span>
              </div>

              {/* Email Field */}
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium">Email:</label>
                <span className="text-gray-700">{data.Email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
