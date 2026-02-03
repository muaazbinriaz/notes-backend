// const mongoose = require("mongoose");
// const DBURL = process.env.DBURL;

// mongoose
//   .connect(DBURL)
//   .then(() => {
//     console.log(`MongoDB connected...`);
//   })
//   .catch((err) => {
//     console.log(`MongoDB connection error: `, err);
//   });

// module.exports = mongoose;

const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  // Prevent deprecated warnings
  mongoose.set("strictQuery", false);

  try {
    // Serverless-optimized connection options
    const options = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Limit connection pool for serverless
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.DBURL, options);

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      isConnected = true;
      console.log("MongoDB connected event fired");
    });

    mongoose.connection.on("error", (err) => {
      isConnected = false;
      console.error("❌ MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.log("⚠️ MongoDB disconnected");
    });

    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // Let the calling function handle the error
  }
};

module.exports = connectDB;
