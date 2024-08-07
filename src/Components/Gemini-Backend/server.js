// gemini-backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import service1Router from './service1.js';
import preprocessRouter from './preprocess.js'; 
import postprocessRouter from './postprocess.js';
import errorcheckerRouter from './errorchecker.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/service1', service1Router);
app.use('/preprocess', preprocessRouter); 
app.use('/postprocess', postprocessRouter); 
app.use('/errorchecker', errorcheckerRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
