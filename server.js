import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoute from './routes/UserRoute.js';
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://redux-frontend-pearl.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());        
app.use(express.urlencoded({ extended: true }));


app.get(["/", "/api", "/api/auth"], (req, res) => {
  res.send("Server is running");
});
app.use("/api/auth", userRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
