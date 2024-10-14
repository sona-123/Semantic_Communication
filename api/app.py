from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import numpy as np
import matplotlib.pyplot as plt
import io
import random  # <-- Import the random module
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the Sentence Transformer model for semantic similarity
model = SentenceTransformer("Sakil/sentence_similarity_semantic_search")

# Function to add Gaussian noise to a message
def add_gaussian_noise_to_message(message, snr, noise_fraction=0.5):
    stddev = 1 / np.sqrt(snr)
    noisy_message = []
    for char in message:
        if random.random() < noise_fraction:
            ascii_value = ord(char)
            noise = np.random.normal(0, stddev)
            noisy_ascii_value = ascii_value + noise
            noisy_ascii_value = np.clip(noisy_ascii_value, 32, 126)
            noisy_char = chr(int(noisy_ascii_value))
        else:
            noisy_char = char
        noisy_message.append(noisy_char)
    return ''.join(noisy_message)

# Route to distort message with Gaussian noise
@app.route('/distort-message', methods=['POST'])
def distort_message():
    data = request.json
    sentence = data.get('sentence')
    snr = data.get('snr', 0.000001)  # Default SNR

    # Add Gaussian noise to the message
    distorted_message = add_gaussian_noise_to_message(sentence, snr)
    
    # Prepare result with distorted message
    result = {
        "content": f"Distorted Message: {distorted_message}"
    }

    return jsonify(result)

# Route to compute semantic similarity between two sentences
@app.route('/similarity', methods=['POST'])
def compute_similarity():
    data = request.json
    original_sentence = data.get('original_sentence')
    translated_sentence = data.get('translated_sentence')

    # Check if both sentences are provided
    if not original_sentence or not translated_sentence:
        return jsonify({"error": "Both 'original_sentence' and 'translated_sentence' are required"}), 400

    # Encode both sentences using the model
    embedding_1 = model.encode(original_sentence, convert_to_tensor=True)
    embedding_2 = model.encode(translated_sentence, convert_to_tensor=True)

    # Compute cosine similarity
    semantic_similarity = util.pytorch_cos_sim(embedding_1, embedding_2).item()

    # Return the similarity score as JSON
    return jsonify({
        "similarity_score": semantic_similarity
    })

# New Route to plot semantic similarity vectors
@app.route('/plot-similarity', methods=['POST'])
def plot_similarity():
    data = request.json

    # Example: data = [{"original": "Sentence 1", "decoded": "Sentence 2", "score": 0.75}, ...]
    
    if not isinstance(data, list) or len(data) == 0:
        return jsonify({"error": "Data should be a non-empty list of sentences and scores."}), 400

    # Ensure all entries have 'original', 'decoded', and 'score'
    for entry in data:
        if 'original' not in entry or 'decoded' not in entry or 'score' not in entry:
            return jsonify({"error": "Each entry should have 'original', 'decoded', and 'score'."}), 400

    # Compute angles from similarity scores (map similarity score to angle in radians)
    angles = [np.arccos(entry["score"]) for entry in data]

    # Plot vectors based on angles
    plt.figure()
    for i, entry in enumerate(data):
        plt.plot([0, np.cos(angles[i])], [0, np.sin(angles[i])], label=f"{entry['original']} -> {entry['decoded']}")

    plt.xlim(-1, 1)
    plt.ylim(-1, 1)
    plt.axhline(0, color='blue', linewidth=1)
    plt.axvline(0, color='blue', linewidth=1)
    plt.legend()
    plt.title("Semantic Similarity Vectors")

    # Save the plot to a bytes buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    # Return the image as a response
    return send_file(img, mimetype='image/png')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

