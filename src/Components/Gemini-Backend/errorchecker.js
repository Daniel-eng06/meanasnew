// gemini-backend/errorchecker.js
import express from 'express';
import { getFirestore, collection, addDoc } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Firestore
const firestore = getFirestore();

// Initialize GoogleGenerativeAI with your API_KEY
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

// Endpoint to handle error-checking data
router.post('/', async (req, res) => {
  try {
    const { goal, imageUrls, analysisType, detailLevel } = req.body;

    // Save data to Firestore
    const projectRef = await addDoc(collection(firestore, 'errorGoals'), {
      goal,
      imageUrls,
      analysisType,
      detailLevel,
      timestamp: new Date(),
    });

    // Generate content using the URI references for the uploaded files and text
    const fileDataArray = imageUrls.map(url => ({
      fileData: {
        mimeType: 'image/jpeg', // Adjust according to your file type
        fileUri: url,
      },
    }));

    const result = await model.generateContent([
      ...fileDataArray,
      { text: 
        `Describe how to solve the error in the analysis with the software ${analysisType}.` },
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
