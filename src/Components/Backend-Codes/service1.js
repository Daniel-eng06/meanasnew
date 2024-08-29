import dotenv from 'dotenv';
import { Router } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import admin from 'firebase-admin';

dotenv.config();

const router = Router();

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
            const response = await openai.createChatCompletion({
                model: "gpt-4o-mini",
                messages: [{ role: 'user', content: msg }],
                stream: true,
                max_tokens: 500,
            }, { responseType: 'stream' });

            let text = '';
            response.data.on('data', (chunk) => {
                // Append the chunk to text and log it
                const chunkText = chunk.toString('utf8');
                text += chunkText;
                console.log('Chunk:', chunkText);
            });

            response.data.on('end', async () => {
                await db.collection('chats').add({ message: msg, response: text, timestamp: new Date() });
                isAwaitingResponse = false; // Reset flag after stream is complete
            });

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
