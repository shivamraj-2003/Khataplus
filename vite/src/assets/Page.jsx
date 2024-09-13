import React, { useState, useEffect } from 'react';

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    const storedFileNames = JSON.parse(localStorage.getItem('uploadedFileNames')) || [];
    setSelectedFiles(storedFileNames);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedFiles = [...selectedFiles, file.name]; 
      setSelectedFiles(updatedFiles);
      localStorage.setItem('uploadedFileNames', JSON.stringify(updatedFiles));
    }
  };

  const toggleShowFiles = () => {
    setShowFiles(!showFiles);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-300 h-screen">
      <div className="flex justify-center items-center space-x-4 w-full max-w-xs mb-4">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={ handleFileUpload }
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          onClick={ toggleShowFiles }
          className="bg-blue-500 text-white px-6 py-2 rounded mb-4 whitespace-nowrap"
        >
          { showFiles ? 'Hide Files' : 'Show Files' }
        </button>
      </div>

      { showFiles && (
        <ul className="w-full max-w-xs">
          { selectedFiles.map((fileName, index) => (
            <li key={ index } className="mb-2 text-center">
              { fileName }
            </li>
          )) }
        </ul>
      ) }
    </div>
  );
}
