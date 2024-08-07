// gemini-backend/service1.js
import dotenv from 'dotenv';
import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';

dotenv.config();

const router = Router();

// Initialize Google GenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

let isAwaitingResponse = false;

async function askAndRespond(msg) {
    if (!isAwaitingResponse) {
        isAwaitingResponse = true; // Set flag to true as we start receiving the stream
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const chat = model.startChat({
                history: [], // Start with an empty history
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });
            const result = await chat.sendMessageStream(msg);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = await chunk.text(); // Assuming chunk.text() returns a Promise
                text += chunkText;
                console.log('AT:', chunkText);
            }
            await db.collection('chats').add({ message: msg, response: text, timestamp: new Date() });
            isAwaitingResponse = false; // Reset flag after stream is complete
        } catch (error) {
            console.error('Error:', error);
            isAwaitingResponse = false; // Ensure flag is reset on error too
        }
    } else {
        console.log('Please wait for the current response to complete.');
    }
}

// Route for AI interaction
router.post('/send-message', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required');
    }

    try {
        await askAndRespond(message);
        res.send('Message sent and processed');
    } catch (error) {
        console.error('Error in askAndRespond:', error);
        res.status(500).send('Server Error');
    }
});

export default router;
