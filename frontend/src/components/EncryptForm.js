// src/components/EncryptForm.js

'use client';
import { useState } from 'react';
import axios from 'axios';

export default function EncryptForm() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEncrypt = async () => {
    if (!message || !password || !image) {
      setError('Please fill in all fields and select an image.');
      return;
    }
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('message', message);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:5000/api/encode', formData, {
        responseType: 'blob', // This is crucial to handle the image file response
      });

      // Create a link to download the image
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'encoded_image.png');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during encryption.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Encrypt a Message</h2>
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
      <div className="space-y-6">
        <textarea
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          placeholder="Enter your secret message here..."
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Upload Base Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
          />
        </div>
        <button
          onClick={handleEncrypt}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Encrypting...' : 'Encrypt & Download Image'}
        </button>
      </div>
    </div>
  );
}