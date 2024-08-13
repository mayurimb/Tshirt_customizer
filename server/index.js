import express from 'express';
//import * as dotenv from 'dotenv';
import cors from 'cors';
import sdiffusionRoutes from './routes/sdiffusion.routes.js';

//dotenv.config();
const app = express();
//const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Allows requests from any origin. You can restrict this to specific origins if needed.
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  }));

app.use(express.json({ limit: "50mb" }))

app.use("/api/sdiffusion", sdiffusionRoutes);

app.listen(3000, () => console.log(`Server has started on port ${port}`))