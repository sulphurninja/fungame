import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0]?.readyState === 1) {
      console.log('Already connected Biatch!');
      return;
    }

    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to Mongodb bitch!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

export default connectDB;
