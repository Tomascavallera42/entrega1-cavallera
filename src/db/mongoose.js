import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/entrega1";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
};

export { connectDB };
