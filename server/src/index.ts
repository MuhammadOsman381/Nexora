import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import modelRouter from './router/Model.router';
import authRouter from './router/Auth.router';
import cors from 'cors';
import chatRouter from './router/Chat.router';
import pricingPlanRouter from './router/PricingPlan.router';


const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://nexora-seven-rosy.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// 🔥 THIS IS THE MOST IMPORTANT LINE
app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/model', modelRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/pricing-plan', pricingPlanRouter);


app.get('/', (_req, res) => {
  res.send('Hello from server!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
