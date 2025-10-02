'use client';
import { useState } from 'react';
import axios from 'axios';
import PasswordStrengthMeter from './PasswordStrengthMeter';

export default function EncryptForm({ activeTab }) {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL for images only
      if (activeTab === 'image') {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  const handleEncrypt = async () => {
    if (!message || !password || !file) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    const isImage = activeTab === 'image';
    const apiUrl = isImage ? 'http://localhost:5000/api/encode' : 'http://localhost:5000/api/encode-audio';

    formData.append(isImage ? 'image' : 'audio', file);
    formData.append('message', message);
    formData.append('password', password);

    try {
      const response = await axios.post(apiUrl, formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        },
      });

      // Create download link for encrypted file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `encrypted_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Reset form
      setMessage('');
      setPassword('');
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError('An error occurred during encryption.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const getPasswordStrength = (password) => {
    // Basic password strength checker
    const strength = { color: 'red', score: 0 };
    if (password.length > 8) strength.score += 1;
    if (/[A-Z]/.test(password)) strength.score += 1;
    if (/[a-z]/.test(password)) strength.score += 1;
    if (/[0-9]/.test(password)) strength.score += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength.score += 1;

    switch (strength.score) {
      case 5:
        strength.color = 'green';
        break;
      case 4:
        strength.color = 'lightgreen';
        break;
      case 3:
        strength.color = 'yellow';
        break;
      case 2:
        strength.color = 'orange';
        break;
      default:
        strength.color = 'red';
    }

    return strength;
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-400">Encrypt a Message</h2>
      
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
      
      <div className="space-y-6">
        {/* File Upload Area with Preview */}
        <div className="relative">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={activeTab === 'image' ? 'image/*' : 'audio/*'}
            />
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                <div className="text-teal-400 font-medium">
                  Processing... {uploadProgress}%
                </div>
                {/* Progress Bar */}
                <div className="w-64 bg-gray-600 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-teal-400 h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : previewUrl && activeTab === 'image' ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-400 text-center">
                  Drop your {activeTab === 'image' ? 'image' : 'audio'} here or click to browse
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {activeTab === 'image' ? 'PNG, JPG' : 'WAV'} files supported
                </p>
              </div>
            )}
          </label>
        </div>

        <textarea
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
          placeholder="Enter your secret message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="space-y-2">
          <div className="relative">
            <input
              type="password"
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3">
              {password && (
                <div className="animate-pulse">
                  <div className="w-2 h-2 bg-current rounded-full" 
                       style={{ color: getPasswordStrength(password).color }} 
                  />
                </div>
              )}
            </div>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={isLoading || !file || !message || !password}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {isLoading ? 'Encrypting...' : 'Encrypt Message'}
        </button>
      </div>
    </div>
  );
}
