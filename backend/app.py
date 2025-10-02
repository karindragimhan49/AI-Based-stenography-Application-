# app.py

import os  
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
from typing import Tuple

# --- Security & Encryption ---
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

# --- App Configuration ---
app = Flask(__name__)
CORS(app)  # Allow requests from our React frontend

# --- Constants ---
DELIMITER = "####" 

# --- Encryption Helper Functions ---

def generate_key_from_password(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=480000, 
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key


def encrypt_message(message: str, password: str) -> Tuple[bytes, bytes]:
    salt = os.urandom(16)
    key = generate_key_from_password(password, salt)
    f = Fernet(key)
    encrypted_message = f.encrypt(message.encode())
    return encrypted_message, salt


def decrypt_message(encrypted_data: bytes, password: str, salt: bytes) -> str:
    key = generate_key_from_password(password, salt)
    f = Fernet(key)
    try:
        decrypted_message = f.decrypt(encrypted_data)
        return decrypted_message.decode()
    except InvalidToken:
        
        raise ValueError("Invalid password or corrupted data")

# --- Steganography Core Functions ---


def hide_data_in_image(image_file, message, password):
    # 1. Message එක encrypt කරගන්නවා
    encrypted_message, salt = encrypt_message(message, password)
    
  
    payload = salt + DELIMITER.encode('utf-8') + encrypted_message + DELIMITER.encode('utf-8')

    binary_payload = ''.join(format(byte, '08b') for byte in payload)
    
    img = Image.open(image_file).convert('RGB')
    width, height = img.size
    
    max_bytes = (width * height * 3) // 8
    if len(binary_payload) > max_bytes:
        raise ValueError("Message is too long for the selected image.")

    img_array = np.array(img)
    data_index = 0
    
    for i in range(height):
        for j in range(width):
            pixel = img_array[i, j]
            for k in range(3): # R, G, B channels
                if data_index < len(binary_payload):
                   
                    pixel[k] = int(format(pixel[k], '08b')[:-1] + binary_payload[data_index], 2)
                    data_index += 1
            if data_index >= len(binary_payload):
                break
        if data_index >= len(binary_payload):
            break
            
    encoded_image = Image.fromarray(img_array)
    return encoded_image


def reveal_data_from_image(image_file, password):
    img = Image.open(image_file).convert('RGB')
    img_array = np.array(img)
    
    binary_data = ""
    delimiter_binary = ''.join(format(ord(c), '08b') for c in DELIMITER)
    
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            for pixel_val in img_array[i, j]:
                binary_data += format(pixel_val, '08b')[-1]

   
    all_bytes = bytearray()
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i:i+8]
        if len(byte) == 8:
            all_bytes.append(int(byte, 2))
            

    delimiter_bytes = DELIMITER.encode('utf-8')
    parts = all_bytes.split(delimiter_bytes)
    
    if len(parts) < 3:
        raise ValueError("No hidden message found or data is corrupted.")
    
    salt = parts[0]
    encrypted_message = parts[1]
   
    decrypted_message = decrypt_message(bytes(encrypted_message), password, bytes(salt))
    return decrypted_message

# --- Audio Steganography Core Functions ---

def hide_data_in_audio(audio_file, message, password):
    # 1. Encrypt the message using the provided password
    encrypted_message, salt = encrypt_message(message, password)
    payload = salt + DELIMITER.encode('utf-8') + encrypted_message + DELIMITER.encode('utf-8')
    binary_payload = ''.join(format(byte, '08b') for byte in payload)

    # 2. Open the WAV file and read its data
    song = wave.open(audio_file, mode='rb')
    nframes = song.getnframes()
    frames = song.readframes(nframes)
    frame_list = list(frames)
    
    # Check if the audio file has enough capacity to hide the message
    if len(binary_payload) > len(frame_list):
        raise ValueError("Message is too long for the selected audio file.")

    # 3. Embed the payload into the least significant bits of the audio frames
    data_index = 0
    for i in range(len(binary_payload)):
        frame_list[i] = (frame_list[i] & 254) | int(binary_payload[data_index])
        data_index += 1
    
    new_frames = bytes(frame_list)
    
    # 4. Create a new audio file with the embedded message
    new_song = wave.open('encoded_audio.wav', 'wb')
    new_song.setparams(song.getparams())
    new_song.writeframes(new_frames)
    song.close()
    new_song.close()

def reveal_data_from_audio(audio_file, password):
    song = wave.open(audio_file, mode='rb')
    frames = bytearray(list(song.readframes(song.getnframes())))
    
    # 1. Extract the binary data from the least significant bits
    binary_data = ''
    for byte in frames:
        binary_data += str(byte & 1)
        
    all_bytes = bytearray()
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i:i+8]
        if len(byte) == 8:
            all_bytes.append(int(byte, 2))
    
    # 2. Split the payload using the defined delimiter
    delimiter_bytes = DELIMITER.encode('utf-8')
    parts = all_bytes.split(delimiter_bytes)
    
    if len(parts) < 3:
        raise ValueError("No hidden message found or data is corrupted.")
    
    salt = parts[0]
    encrypted_message = parts[1]
    
    # 3. Decrypt the extracted message
    decrypted_message = decrypt_message(bytes(encrypted_message), password, bytes(salt))
    return decrypted_message

# --- New API Endpoints for Audio ---

@app.route('/api/encode-audio', methods=['POST'])
def encode_audio_api():
    if 'audio' not in request.files or 'message' not in request.form or 'password' not in request.form:
        return jsonify({'error': 'Missing required fields (audio, message, password)'}), 400
    
    audio_file = request.files['audio']
    message = request.form['message']
    password = request.form['password']

    try:
        hide_data_in_audio(audio_file, message, password)
        return send_file('encoded_audio.wav', mimetype='audio/wav', as_attachment=True, download_name='encoded_audio.wav')
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/decode-audio', methods=['POST'])
def decode_audio_api():
        if 'audio' not in request.files or 'password' not in request.form:
            return jsonify({'error': 'Missing required fields (audio, password)'}), 400
            
        audio_file = request.files['audio']
        password = request.form['password']

        try:
            message = reveal_data_from_audio(audio_file, password)
            return jsonify({'message': message})
        except ValueError as e:
            return jsonify({'error': str(e)}), 401
        except Exception as e:
            return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500


# --- API Endpoints ---

@app.route('/api/encode', methods=['POST'])
def encode_api():
    if 'image' not in request.files or 'message' not in request.form or 'password' not in request.form:
        return jsonify({'error': 'Missing required fields (image, message, password)'}), 400

    image_file = request.files['image']
    message = request.form['message']
    password = request.form['password']

    if not message or not password:
        return jsonify({'error': 'Message and password cannot be empty'}), 400

    try:
        encoded_image = hide_data_in_image(image_file, message, password)
        
        byte_arr = io.BytesIO()
        encoded_image.save(byte_arr, format='PNG')
        byte_arr.seek(0)
        
        return send_file(
            byte_arr,
            mimetype='image/png',
            as_attachment=True,
            download_name='encoded_image.png'
        )
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/decode', methods=['POST'])
def decode_api():
    if 'image' not in request.files or 'password' not in request.form:
        return jsonify({'error': 'Missing required fields (image, password)'}), 400

    image_file = request.files['image']
    password = request.form['password']

    if not password:
        return jsonify({'error': 'Password cannot be empty'}), 400

    try:
        revealed_message = reveal_data_from_image(image_file, password)
        return jsonify({'message': revealed_message})
    except ValueError as e:
     
        return jsonify({'error': str(e)}), 401 # 401 Unauthorized
    except Exception as e:
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500


# --- Main execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)