# app.py
import re
import os
import io
import wave
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
from typing import Tuple, List, Dict
from functools import wraps

# --- Security & Encryption ---
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

# --- App Configuration ---
app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Logging
logging.basicConfig(level=logging.INFO)

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


def hide_data_in_image(image_file, message: str, password: str) -> Image.Image:
    # Encrypt
    encrypted_message, salt = encrypt_message(message, password)

    payload = salt + DELIMITER.encode("utf-8") + encrypted_message + DELIMITER.encode(
        "utf-8"
    )

    # convert to bit string
    binary_payload = "".join(format(byte, "08b") for byte in payload)

    img = Image.open(image_file).convert("RGB")
    width, height = img.size

    # capacity in bits
    capacity_bits = width * height * 3
    if len(binary_payload) > capacity_bits:
        raise ValueError("Message is too long for the selected image.")

    img_array = np.array(img, dtype=np.uint8)
    data_index = 0

    for i in range(height):
        for j in range(width):
            # modify each channel LSB
            for k in range(3):  # R, G, B
                if data_index < len(binary_payload):
                    # replace LSB with next bit
                    channel_bin = format(int(img_array[i, j, k]), "08b")
                    new_channel_bin = channel_bin[:-1] + binary_payload[data_index]
                    img_array[i, j, k] = int(new_channel_bin, 2)
                    data_index += 1
            if data_index >= len(binary_payload):
                break
        if data_index >= len(binary_payload):
            break

    encoded_image = Image.fromarray(img_array)
    return encoded_image


def reveal_data_from_image(image_file, password: str) -> str:
    img = Image.open(image_file).convert("RGB")
    img_array = np.array(img, dtype=np.uint8)

    # Collect LSBs
    binary_data = ""
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            for pixel_val in img_array[i, j]:
                binary_data += format(int(pixel_val), "08b")[-1]

    # Group into bytes
    all_bytes = bytearray()
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i : i + 8]
        if len(byte) == 8:
            all_bytes.append(int(byte, 2))

    delimiter_bytes = DELIMITER.encode("utf-8")
    parts = all_bytes.split(delimiter_bytes)

    if len(parts) < 3:
        raise ValueError("No hidden message found or data is corrupted.")

    salt = parts[0]
    encrypted_message = parts[1]

    decrypted_message = decrypt_message(bytes(encrypted_message), password, bytes(salt))
    return decrypted_message


# --- Audio Steganography Core Functions ---


def hide_data_in_audio(audio_file, message: str, password: str) -> str:
    """
    Embeds a message into the least-significant bits of a WAV file's raw bytes.
    Returns path to the encoded file.
    """
    encrypted_message, salt = encrypt_message(message, password)
    payload = salt + DELIMITER.encode("utf-8") + encrypted_message + DELIMITER.encode(
        "utf-8"
    )
    binary_payload = "".join(format(byte, "08b") for byte in payload)

    # open wav
    song = wave.open(audio_file, mode="rb")
    params = song.getparams()
    frames = song.readframes(song.getnframes())
    song.close()

    frame_list = list(frames)  # bytes -> list of ints

    # capacity in bits equals number of frame bytes
    if len(binary_payload) > len(frame_list):
        raise ValueError("Message is too long for the selected audio file.")

    # embed
    for i in range(len(binary_payload)):
        frame_list[i] = (frame_list[i] & 254) | int(binary_payload[i])

    new_frames = bytes(frame_list)

    out_path = "encoded_audio.wav"
    new_song = wave.open(out_path, "wb")
    new_song.setparams(params)
    new_song.writeframes(new_frames)
    new_song.close()
    return out_path


def reveal_data_from_audio(audio_file, password: str) -> str:
    song = wave.open(audio_file, mode="rb")
    frames = bytearray(list(song.readframes(song.getnframes())))
    song.close()

    binary_data = ""
    for byte in frames:
        binary_data += str(byte & 1)

    all_bytes = bytearray()
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i : i + 8]
        if len(byte) == 8:
            all_bytes.append(int(byte, 2))

    delimiter_bytes = DELIMITER.encode("utf-8")
    parts = all_bytes.split(delimiter_bytes)

    if len(parts) < 3:
        raise ValueError("No hidden message found or data is corrupted.")

    salt = parts[0]
    encrypted_message = parts[1]

    decrypted_message = decrypt_message(bytes(encrypted_message), password, bytes(salt))
    return decrypted_message


# --- New API Endpoints for Audio ---


@app.route("/api/encode-audio", methods=["POST"])
def encode_audio_api():
    if "audio" not in request.files or "message" not in request.form or "password" not in request.form:
        return jsonify({"error": "Missing required fields (audio, message, password)"}), 400

    audio_file = request.files["audio"]
    message = request.form["message"]
    password = request.form["password"]

    if not message or not password:
        return jsonify({"error": "Message and password cannot be empty"}), 400

    try:
        out_path = hide_data_in_audio(audio_file, message, password)
        return send_file(out_path, mimetype="audio/wav", as_attachment=True, download_name="encoded_audio.wav")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logging.exception("Unexpected error in encode-audio")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route("/api/decode-audio", methods=["POST"])
def decode_audio_api():
    if "audio" not in request.files or "password" not in request.form:
        return jsonify({"error": "Missing required fields (audio, password)"}), 400

    audio_file = request.files["audio"]
    password = request.form["password"]

    if not password:
        return jsonify({"error": "Password cannot be empty"}), 400

    try:
        message = reveal_data_from_audio(audio_file, password)
        return jsonify({"message": message})
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        logging.exception("Unexpected error in decode-audio")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- API Endpoints for Images ---


@app.route("/api/encode", methods=["POST"])
def encode_api():
    if "image" not in request.files or "message" not in request.form or "password" not in request.form:
        return jsonify({"error": "Missing required fields (image, message, password)"}), 400

    image_file = request.files["image"]
    message = request.form["message"]
    password = request.form["password"]

    if not message or not password:
        return jsonify({"error": "Message and password cannot be empty"}), 400

    try:
        encoded_image = hide_data_in_image(image_file, message, password)

        byte_arr = io.BytesIO()
        encoded_image.save(byte_arr, format="PNG")
        byte_arr.seek(0)

        return send_file(
            byte_arr,
            mimetype="image/png",
            as_attachment=True,
            download_name="encoded_image.png",
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logging.exception("Unexpected error in encode")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route("/api/decode", methods=["POST"])
def decode_api():
    if "image" not in request.files or "password" not in request.form:
        return jsonify({"error": "Missing required fields (image, password)"}), 400

    image_file = request.files["image"]
    password = request.form["password"]

    if not password:
        return jsonify({"error": "Password cannot be empty"}), 400

    try:
        revealed_message = reveal_data_from_image(image_file, password)
        return jsonify({"message": revealed_message})
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        logging.exception("Unexpected error in decode")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- New Helper Functions ---


def validate_request_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400
        return f(*args, **kwargs)

    return decorated_function


def analyze_sensitive_data(text: str) -> List[Dict[str, str]]:
    """
    Returns list of findings with 'type' and 'match' keys.
    Common patterns: email, phone, credit-card-like, ssn-like.
    """
    findings = []
    
    patterns = {
        "Email Address": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "Credit Card": r'\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b',
        "Phone Number (LK)": r'\b(?:\+94|0)[1-9][0-9]{8}\b'
    }
    
    for pattern_type, pattern in patterns.items():
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            findings.append({
                "type": pattern_type,
                "value": match.group()
            })
    
    return findings


@app.route("/api/analyze-text", methods=["POST"])
@validate_request_json
def analyze_text_api():
    try:
        text = request.json.get('text')
        if not text:
            return jsonify([]), 200

        logging.info(f"Analyzing text: {text[:30]}...")  # Log first 30 chars for debugging
        
        findings = analyze_sensitive_data(text)
        logging.info(f"Found sensitive data: {findings}")  # Log findings
        
        return jsonify(findings), 200

    except Exception as e:
        logging.error(f"Error analyzing text: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
