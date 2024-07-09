import React, { useState } from "react";
import { storage, db } from "../firebase"; // Adjust the path if necessary
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const Upload = () => {
  const [text, setText] = useState("");
  const [material, setMaterial] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [response, setResponse] = useState("");

  const handleUpload = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setResponse("");

  if (!image) {
    setError("Please select an image to upload.");
    return;
  }

  const storageRef = ref(storage, `images/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    "state_changed",
    null,
    (error) => handleError(error),
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "uploads"), {  // Remove docRef assignment
          text,
          material,
          imageUrl: downloadURL,
        });

        const gptResponse = await axios.post("https://YOUR_CLOUD_FUNCTION_URL/analyze", {
          text,
          material,
          imageUrl: downloadURL,
        });

        setResponse(gptResponse.data.text); // Extract the text field
        setText("");
        setMaterial("");
        setImage(null);
        setSuccess("Upload successful!");
      } catch (error) {
        handleError(error);
       }
     }
   );
  };


  const handleError = (error) => {
    console.error("Upload error:", error);
    setError("An error occurred while uploading. Please try again later.");
  };

  return (
    <div>
      <h2>Upload Text, Material, and Image</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleUpload}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter some text"
          required
        />
        <input
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Enter material used"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
        <button type="submit">Upload</button>
      </form>

      {response && (
        <div>
          <h3>GPT Solution</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
