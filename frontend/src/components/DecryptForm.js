// src/components/DecryptForm.js

'use client';
import { useState } from 'react';
import axios from 'axios';

export default function DecryptForm() {
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');

  const handleDecrypt = async () => {
    if (!password || !image) {
      setError('Please provide the password and select the encoded image.');
      setDecodedMessage('');
      return;
    }
    setIsLoading(true);
    setError('');
    setDecodedMessage('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:5000/api/decode', formData);
      setDecodedMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to decrypt. Check password or image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-400">Decrypt a Message</h2>
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
      {decodedMessage && (
        <div className="bg-green-500/20 text-green-300 p-4 rounded-md mb-4">
          <h3 className="font-bold mb-2">Decoded Message:</h3>
          <p className="font-mono bg-gray-900 p-3 rounded">{decodedMessage}</p>
        </div>
      )}
      <div className="space-y-6">
        <input
          type="password"
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
          placeholder="Enter the password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Upload Encoded Image</label>
          <input
            type="file"
            accept="image/png"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
          />
        </div>
        <button
          onClick={handleDecrypt}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Decrypting...' : 'Decrypt Message'}
        </button>
      </div>
    </div>
  );
}