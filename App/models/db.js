const mongoose = require("mongoose");
const DBURL = process.env.DBURL;

mongoose
  .connect(DBURL)
  .then(() => {
    console.log(`MongoDB connected...`);
  })
  .catch((err) => {
    console.log(`MongoDB connection error: `, err);
  });
