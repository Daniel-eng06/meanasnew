import {KeyID} from "./OpenAI###.js";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const OPENAI_API_KEY = {KeyID};

exports.analyze = functions.https.onRequest(async (req, res) => {
  const { text, material, imageUrl } = req.body;

  const prompt = `
    As an Expert in FEA analysis using these factors:
    1. Material used: ${material}.
    2. Based on the provided image (${imageUrl}), give locations where the high stress are and other critical areas.
    3. Compare Ultimate yield stress of the material with the analyzed maximum stress and interpret the visual results.
    4. Provide recommendations in terms of sample values of boundary conditions, materials that can be used, and mesh quality for maximum accuracy.
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ text: response.data.choices[0].text }); // Adjust to return JSON object
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});
