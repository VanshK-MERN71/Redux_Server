import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "";

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (mongoUri.includes("<db_password>")) {
      throw new Error(
        "MONGO_URI still has <db_password> placeholder. Replace it with real Atlas DB user password."
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`Mongo connection failed: ${error.message}`);
  } 
};

export default connectDB;
