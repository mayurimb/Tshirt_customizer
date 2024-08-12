import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;

router.route('/').post(async (req, res) => {
  try {
        //const { prompt } = req.body;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
            {
                headers: {
                    Authorization: `Bearer hf_${STABLE_DIFFUSION_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(req.body.inputs ),
            }
        );
        const result = await (await response.blob()).arrayBuffer()
        res.status(200).send(Buffer.from(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
