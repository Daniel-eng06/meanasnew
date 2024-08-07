// gemini-backend/preprocess.js
import express from 'express';
import { getFirestore, collection, addDoc } from 'firebase-admin/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase-admin/storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// Initialize Firestore and Storage
const firestore = getFirestore();
const storage = getStorage();

// Initialize GoogleGenerativeAI with your API_KEY
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

// Endpoint to handle data processing
router.post('/', async (req, res) => {
  try {
    const { description, imageUrls, materials, option, customOption, analysisType } = req.body;

    // Save data to Firestore
    const projectRef = await addDoc(collection(firestore, 'projects'), {
      description,
      imageUrls,
      materials,
      option,
      customOption,
      analysisType,
      timestamp: new Date(),
    });

    // Upload images to Firebase Storage and get their URLs
    const uploadedImageUrls = await Promise.all(imageUrls.map(async (url, index) => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const storageRef = ref(storage, `uploads/${projectRef.id}_${index}.jpg`);
      await uploadBytes(storageRef, buffer, { contentType: 'image/jpeg' });
      return getDownloadURL(storageRef);
    }));

    // Generate content using text and the URI references for the uploaded files
    const fileDataArray = uploadedImageUrls.map(uploadedUrl => ({
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: uploadedUrl,
      },
    }));

    let promptText;
    if (analysisType === 'FEA') {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is FEA.`;
    } else if (analysisType === 'CFD') {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is CFD.`;
    } else {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is ${analysisType}.`;
    }

    const result = await model.generateContent([
      ...fileDataArray,
      { text: promptText },
    ]);

    const generatedResponse = result.response.text();

    // Save the generated response to Firestore
    await addDoc(collection(firestore, 'responses'), {
      projectId: projectRef.id,
      generatedResponse,
      timestamp: new Date(),
    });

    res.status(200).json({ id: projectRef.id, response: generatedResponse });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Failed to process data' });
  }
});

export default router;
