import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { saveFile, loadFiles } from './Data';

const Page = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  // Handle file uploads
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    // Save files to IndexedDB
    files.forEach((file) => saveFile(file));
  };

  // Toggle visibility of uploaded files
  const toggleShowFiles = () => {
    setShowFiles((prev) => !prev);
  };

  // Open file in a new tab
  const openFile = (file) => {
    const blob = new Blob([file.data], { type: file.type });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  };

  // Load files from IndexedDB on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await loadFiles();
      setSelectedFiles(files);
    };
    fetchFiles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lime-400 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Upload a File</h2>
          <div className="border-2 border-dashed border-green-400 rounded-lg p-4 md:p-6 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={ handleFileUpload }
              className="hidden"
              id="file-upload"
              multiple
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-green-500 mb-2" />
              <span className="text-sm md:text-base text-green-600">
                DRAG AND DROP A FILE OR SELECT ADD IMAGE
              </span>
            </label>
          </div>
          <button
            onClick={ toggleShowFiles }
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300 text-sm md:text-base"
          >
            { showFiles ? 'HIDE FILES' : 'SHOW FILES' }
          </button>
        </div>
      </div>
      { showFiles && (
        <div className="w-full max-w-md mt-4 bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Uploaded Files:</h3>
          { selectedFiles.length > 0 ? (
            <ul className="space-y-2">
              { selectedFiles.map((file, index) => (
                <li
                  key={ index }
                  className="text-blue-600 underline cursor-pointer text-sm md:text-base"
                  onClick={ () => openFile(file) }
                >
                  { file.name }
                </li>
              )) }
            </ul>
          ) : (
            <p className="text-gray-600 text-sm md:text-base">No files uploaded.</p>
          ) }
        </div>
      ) }
    </div>
  );
};

export default Page;
