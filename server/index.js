import express from 'express';
import cors from 'cors';
import sdiffusionRoutes from './routes/sdiffusion.routes.js';

const app = express();

app.use(cors({
    origin: ['https://t-customizer.vercel.app'],
    allowedHeaders: 'Content-Type,Authorization',
  }));

app.use(express.json({ limit: "50mb" }))

app.use("/api/sdiffusion", sdiffusionRoutes);

app.listen(3000, () => console.log(`Server has started on port ${port}`))