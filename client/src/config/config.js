import * as dotenv from 'dotenv';

dotenv.config();
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const config = {
    backendUrl: `${REACT_APP_BACKEND_URL}api/sdiffusion` ||"http://localhost:3000/api/sdiffusion",
};

export default config;
