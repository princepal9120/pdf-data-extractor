import React, { useState } from "react";
import axios from "axios";

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result.split(",")[1];

      try {
        const response = await axios.post("https://pdf-data-extractor-tjdv.onrender.com/extract", {
          file: base64,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("Something went wrong while uploading the file!");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg transform transition-all duration-300 hover:scale-105">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://img.icons8.com/color/96/000000/pdf.png"
            alt="PDF Logo"
            className="w-16 h-16 mr-4"
          />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            PDF Extractor
          </h1>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
          <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <svg
              className="w-12 h-12 mx-auto text-purple-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {file ? file.name : "Drag & drop or click to upload"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload and Extract"}
          </button>
          <button
            onClick={() => {
              setFile(null);
              setData(null);
            }}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-lg hover:bg-gray-400 transition-all"
          >
            Reset
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mb-6">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Extracted Data Section */}
        {data && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Extracted Data:</h3>
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <label className="text-gray-700 font-medium">{key}:</label>
                  <span className="text-gray-800 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;