import React, { useState, useEffect } from "react";
import "./Errorchecker.css";
import { storage, db } from '../../firebase'; 
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import Footer from "../Home/Footer";
import Grid from "../../Grid";
import Defaultbars from "./Defaultbars";

function Errorchecker() {
    const [file, setFile] = useState(null);
    const [goal, setGoal] = useState('');
    const [response, setResponse] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const querySnapshot = await collection(db, 'errorGoals').get();
            let images = [];
            querySnapshot.forEach((doc) => {
                images.push({ id: doc.id, ...doc.data() });
            });
            setUploadedImages(images);
        };

        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleGoalChange = (e) => {
        setGoal(e.target.value);
    };

    const handleDeleteImage = (index) => {
        setFile((prevImages) => prevImages.filter((_, i) => i !== index));
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !goal) {
            alert("Please upload an image and enter your goal.");
            return;
        }

        try {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `errors/${file.name}`);
            await uploadBytes(storageRef, file);
            const imageURL = await getDownloadURL(storageRef);

            // Add goal and imageURL to Firestore
            const docRef = await addDoc(collection(db, 'errorGoals'), {
                goal: goal,
                imageURL: imageURL,
                timestamp: new Date()
            });

            setFile(null);
            setGoal('');
            setResponse('');

            alert('Image uploaded successfully!');
        } catch (error) {
            console.error("Error uploading file or sending data", error);
        }
    };

    return (
        <div>
            <video id="background-video" src="Gradient 2.mp4" controls loop autoPlay muted></video>
            <Grid />
            <Defaultbars />
            <div className='current'>
                <div><img src="error.png" alt="Errorchecker" /></div>
                <h2>FEA/CFD Analysis Error Solutions</h2>
            </div>

            <div className="errorcheck">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="imageUpload" id="title">Upload Images Of Your Analysis Errors:</label>
                    <div className="custom-file-upload">
                        <label htmlFor="imageUpload" id="hov">
                            <FaUpload size={30} />
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            required
                        />
                    </div>
                    <label htmlFor="description" id="title">What Are You Trying To Achieve?</label>
                    <textarea
                        placeholder="Describe what you want to achieve in order to overcome this analysis error..."
                        value={goal}
                        onChange={handleGoalChange}
                        required
                    ></textarea>
                    <button type="submit">Generate Clarity</button>
                </form>
            </div>

            <div className="uploaded-images">
                {uploadedImages.map((image) => (
                    <div key={image.id} className="image-container">
                        <img src={image.imageURL} alt={`Uploaded Error ${image.id}`} />
                        <button onClick={() => handleDeleteImage(image.id, image.imageURL)}>
                            <FaTrashAlt />
                        </button>
                    </div>
                ))}
            </div>

            <div className="response-container">
                <div className="response">{response}</div>
            </div>
            <button className='report'>
                Generate Report
            </button>
            <Footer />
        </div>
    );
}

export default Errorchecker;
