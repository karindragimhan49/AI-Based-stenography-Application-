'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DecryptionAnimation from './DecryptionAnimation';

export default function DecryptForm({ activeTab }) {
  const fileInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [attempts, setAttempts] = useState(3); // Add attempts counter
  const [isLocked, setIsLocked] = useState(false); // Add locked state
  // Add a preview for the encrypted file
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDecrypt = async () => {
    if (isLocked) {
      setError('Maximum attempts reached. Please refresh the page to try again.');
      return;
    }

    if (!password || !file) {
      setError(`Please provide the password and select the encoded ${activeTab}.`);
      setDecodedMessage('');
      return;
    }

    setIsLoading(true);
    setError('');
    setDecodedMessage('');

    const formData = new FormData();
    const isImage = activeTab === 'image';
    const apiUrl = isImage ? 'http://localhost:5000/api/decode' : 'http://localhost:5000/api/decode-audio';
    const fileKey = isImage ? 'image' : 'audio';

    formData.append(fileKey, file);
    formData.append('password', password);

    try {
      const response = await axios.post(apiUrl, formData);
      setDecodedMessage(response.data.message);
      // Reset attempts on successful decrypt
      setAttempts(3);
    } catch (err) {
      const remainingAttempts = attempts - 1;
      setAttempts(remainingAttempts);
      
      if (remainingAttempts === 0) {
        setIsLocked(true);
        setError('Maximum attempts reached. Please refresh the page to try again.');
      } else {
        setError(`${err.response?.data?.error || 'An unknown error occurred.'} (${remainingAttempts} attempts remaining)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modify file change handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Clear previous preview if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create preview for images
      if (activeTab === 'image') {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-400">
        Decrypt a Message {attempts < 3 && !isLocked && (
          <span className="text-sm text-yellow-400 ml-2">
            ({attempts} attempts remaining)
          </span>
        )}
      </h2>
      
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
      
      {isLoading && <DecryptionAnimation />}
      
      {decodedMessage && (
        <div className="bg-green-500/20 text-green-300 p-4 rounded-md mb-4">
          <h3 className="font-bold mb-2">Decoded Message:</h3>
          <p className="font-mono bg-gray-900 p-3 rounded break-words">{decodedMessage}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <input
          type="password"
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
          placeholder="Enter the password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLocked}
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">
            Upload Encoded {activeTab === 'image' ? 'Image' : 'Audio (.wav)'}
          </label>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={activeTab === 'image' ? 'image/png, image/jpeg, image/jpg' : 'audio/wav'}
                disabled={isLocked}
              />
              
              {previewUrl && activeTab === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Encrypted"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-400">
                    Upload encrypted {activeTab === 'image' ? 'image (PNG, JPG)' : 'audio file'}
                  </p>
                </div>
              )}
            </label>
            
            {file && (
              <p className="text-sm text-gray-400">
                Selected file: {file.name}
                {activeTab === 'image' && !file.type.match(/(png|jpeg|jpg)/i) && (
                  <span className="text-yellow-400 ml-2">
                    Warning: Please select a PNG or JPG file
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDecrypt}
          disabled={isLoading || isLocked}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Decrypting...' : isLocked ? 'Locked' : 'Decrypt Message'}
        </button>
      </div>
    </div>
  );
}
