'use client';
import { useState } from 'react';
import axios from 'axios';
import DecryptionAnimation from './DecryptionAnimation';

export default function DecryptForm({ activeTab }) {
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [attempts, setAttempts] = useState(3); // Add attempts counter
  const [isLocked, setIsLocked] = useState(false); // Add locked state

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
          <input
            type="file"
            key={activeTab}
            accept={activeTab === 'image' ? 'image/png' : 'audio/wav'}
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 disabled:opacity-50"
            disabled={isLocked}
          />
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
