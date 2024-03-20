import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0]?.readyState === 1) {
      console.log('Already connected to MongoDB!');
      return mongoose.connections[0]; // Return the existing connection
    }

    mongoose.set("strictQuery", false);

    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true, // Add this option to avoid deprecation warning
      useCreateIndex: true, // Add this option to avoid deprecation warning
    });

    console.log("Connected to MongoDB!");
    return connection; // Return the new connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

export default connectDB;
