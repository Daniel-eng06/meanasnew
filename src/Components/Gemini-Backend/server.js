// gemini-backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import service1Router from './service1.js'; // Import the updated router

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/service1', service1Router); // Add the updated router

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
