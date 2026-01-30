import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import modelRouter from './router/Model.router';
import authRouter from './router/Auth.router';
import cors from 'cors';
import chatRouter from './router/Chat.router';
import pricingPlanRouter from './router/PricingPlan.router';


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  "https://nexora-seven-rosy.vercel.app/"
];

app.use(cors({ origin: allowedOrigins }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/model', modelRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/pricing-plan', pricingPlanRouter);


app.get('/', (_req, res) => {
  res.send('Hello from server!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
