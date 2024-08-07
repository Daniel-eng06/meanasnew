// gemini-backend/postprocess.js
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

// Endpoint to handle post-processing data
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

    // Generate content using text and the URI references for the uploaded files
    const fileDataArray = imageUrls.map(url => ({
      fileData: {
        mimeType: 'image/jpeg', // Change this according to your file type
        fileUri: url,
      },
    }));

    let promptText;
    if (analysisType === 'FEA') {
      promptText = `Describe how this product might be manufactured with analysis type FEA and detail level ${detailLevel.join(', ')}.`;
    } else if (analysisType === 'CFD') {
      promptText = `Describe how this product might be manufactured with analysis type CFD and detail level ${detailLevel.join(', ')}.`;
    } else {
      promptText = `Describe how this product might be manufactured with analysis type ${analysisType} and detail level ${detailLevel.join(', ')}.`;
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
