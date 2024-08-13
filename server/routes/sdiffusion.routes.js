import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from Stable Diffusion route" })
})


router.route('/').post(async (req, res) => {
  try {
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
        if (!response.ok) {
          throw new Error('Failed to fetch from Stable Diffusion API');
        }
        const result = await (await response.blob()).arrayBuffer()
        res.status(200).send(Buffer.from(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
