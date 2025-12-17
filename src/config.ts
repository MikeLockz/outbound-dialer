import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  vapi: {
    baseUrl: process.env.VAPI_BASE_URL || 'https://api.vapi.ai',
    apiKey: process.env.VAPI_API_KEY || '',
  },
};
