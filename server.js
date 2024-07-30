// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/firebase-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.use(bodyParser.json());

app.post('/process', async (req, res) => {
  const { description, imageUrls, materials, option, customOption, analysisType } = req.body;

  try {
    let prompt;

    if (analysisType === 'FEA') {
      prompt = `FEA Analysis Request:
            Description: ${description}
            Materials: ${materials.join(', ')}
            Option: ${option === 'other' ? customOption : option}
            Image URLs: ${imageUrls.join(', ')}`;
                } else if (analysisType === 'CFD') {
                prompt = `CFD Analysis Request:
            Description: ${description}
            Materials: ${materials.join(', ')}
            Option: ${option === 'other' ? customOption : option}
            Image URLs: ${imageUrls.join(', ')}`;
                } else {
                prompt = `General Analysis Request:
            Description: ${description}
            Materials: ${materials.join(', ')}
            Option: ${option === 'other' ? customOption : option}
            Image URLs: ${imageUrls.join(', ')}`;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/gemini', // Replace with actual Gemini Vision API endpoint
      {
        prompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedResponse = response.data;
    const docRef = await db.collection('projects').add({
      imageUrls,
      description,
      materials,
      option: option === 'other' ? customOption : option,
      analysisType,
      responses: [generatedResponse], // Store responses as an array
      createdAt: new Date(),
    });

    res.json({ id: docRef.id, response: generatedResponse });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
