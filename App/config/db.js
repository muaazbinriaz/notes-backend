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
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.DBURL, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log("MongoDB connected...");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
