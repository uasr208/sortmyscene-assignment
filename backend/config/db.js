import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` database Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Error connecting to database: ${error.message}`);
    process.exit(1); // Stop the server completely if we cannot connect
  }
};

export default connectDB;
