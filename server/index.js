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
app.options('*', cors());
app.use(express.json({ limit: "50mb" }))
app.use("/api/sdiffusion", sdiffusionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server has started on port ${PORT}"))
