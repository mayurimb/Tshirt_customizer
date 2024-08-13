import express from 'express';
import cors from 'cors';
import sdiffusionRoutes from './routes/sdiffusion.routes.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://t-customizer.vercel.app'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  }));
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }))

app.use("/api/sdiffusion", sdiffusionRoutes);
app.listen(3000, () => console.log("Server has started on port 3000"))