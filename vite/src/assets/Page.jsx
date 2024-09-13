import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

export default function FileUploadPreview() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    try {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
      // Filter out invalid file objects
      const validFiles = storedFiles.filter(file => file && file.name && file.data);
      setSelectedFiles(validFiles);
    } catch (error) {
      console.error('Failed to load files from localStorage:', error);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result;
        if (base64File) {
          const fileData = {
            name: file.name,
            data: base64File
          };
          const updatedFiles = [...selectedFiles, fileData];
          try {
            setSelectedFiles(updatedFiles);
            localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
          } catch (error) {
            console.error('Failed to save files to localStorage:', error);
          }
        } else {
          console.error('Failed to convert file to Base64');
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  };

  const openFile = (fileData) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe src="${fileData}" width="100%" height="100%"></iframe>`);
    } else {
      console.error('Failed to open new window');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">File Upload</h1>

        <div className="border-2 border-indigo-200 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-indigo-400 mb-4" />
            <p className="text-gray-500 mb-4">Select a file or drag here</p>
            <label htmlFor="file-upload" className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700 transition duration-300">
              Select a file
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={ handleFileUpload }
              className="hidden"
            />
          </div>
        </div>

        { selectedFiles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Uploaded Files:</h2>
            <ul>
              { selectedFiles.map((file, index) => (
                // Add a defensive check here
                file && file.name ? (
                  <li
                    key={ index }
                    className="text-indigo-600 underline cursor-pointer mb-1"
                    onClick={ () => openFile(file.data) }
                  >
                    { file.name }
                  </li>
                ) : (
                  <li key={ index } className="text-red-600 mb-1">
                    Error: Invalid file
                  </li>
                )
              )) }
            </ul>
          </div>
        ) }
      </div>
    </div>
  );
}
