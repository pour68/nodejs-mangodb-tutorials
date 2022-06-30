const mongoose = require("mongoose");

const uri = process.env.DATABASE_URI;
const connectionDb = async () => {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectionDb;
