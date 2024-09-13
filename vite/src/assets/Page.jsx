import React, { useState, useEffect } from 'react';

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    try {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
      setSelectedFiles(storedFiles);
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

  const toggleShowFiles = () => {
    setShowFiles(!showFiles);
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
    <div className="flex flex-col justify-center items-center bg-slate-300 min-h-screen p-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-3xl">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={ handleFileUpload }
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full sm:w-auto"
        />

        <button
          onClick={ toggleShowFiles }
          className="bg-blue-500 text-white px-6 py-2 rounded whitespace-nowrap"
        >
          { showFiles ? 'Hide Files' : 'Show Files' }
        </button>
      </div>

      { showFiles && (
        <ul className="w-full max-w-3xl mt-4">
          { selectedFiles.length > 0 ? (
            selectedFiles.map((file, index) => (
              file && file.name ? (
                <li
                  key={ index }
                  className="mb-2 text-center text-blue-600 underline cursor-pointer"
                  onClick={ () => openFile(file.data) }
                >
                  { file.name }
                </li>
              ) : (
                <li key={ index } className="mb-2 text-center text-red-600">
                  Error: Invalid file data
                </li>
              )
            ))
          ) : (
            <li className="text-center">No files uploaded</li>
          ) }
        </ul>
      ) }
    </div>
  );
}
