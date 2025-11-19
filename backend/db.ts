
import mongoose from 'mongoose';

// Connection string provided by user
const MONGODB_URI = "mongodb+srv://Vercel-Admin-bdd-proyecto:wiWE9R63eGfQ2EFj@bdd-proyecto.gbhvwlp.mongodb.net/?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    // Note: This connection logic is designed for a Node.js server environment.
    // Browsers cannot connect directly to MongoDB via TCP.
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

export default connectDB;