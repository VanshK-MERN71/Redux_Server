import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoute from './routes/UserRoute.js';
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://redux-frontend-brown.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
