// gemini-backend/postprocess.js
import express from 'express';
import { getFirestore, collection, addDoc } from 'firebase-admin/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// Initialize Firestore and Storage
const firestore = getFirestore();
const storage = getStorage();

// Function to make an API call to OpenAI Vision Pro
async function callOpenAIVisionPro(imageUrls, promptText) {
  const data = {
    images: imageUrls.map(url => ({ url })),
    prompt: promptText,
  };

  const response = await axios.post('https://api.openai.com/v1/images', data, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

// Endpoint to handle data processing
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

    // Upload images to Firebase Storage and get their URLs
    const uploadedImageUrls = await Promise.all(imageUrls.map(async (url, index) => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const storageRef = ref(storage, `uploads/${projectRef.id}_${index}.jpg`);
      await uploadBytes(storageRef, buffer, { contentType: 'image/jpeg' });
      return getDownloadURL(storageRef);
    }));

    // Create the prompt text based on the analysis type
    let promptText;
    if (analysisType === 'FEA') {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is FEA.`;
    } else if (analysisType === 'CFD') {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is CFD.`;
    } else {
      promptText = `Describe how to execute the project with the materials ${materials} and options ${option} ${customOption}. The analysis type is ${analysisType}.`;
    }

    // Call OpenAI Vision Pro to process images and the prompt
    const openAIResponse = await callOpenAIVisionPro(uploadedImageUrls, promptText);
    const generatedResponse = openAIResponse.choices[0].text;

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
