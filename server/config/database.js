const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const dbConfig = process.env.MONGO_URL;
    const connect = await mongoose.connect(dbConfig);
    console.log(`Mongodb connected: ${connect.connection.host}`);
  } catch (e) {
    console.log('Error connect to mongodb:', e);
  }
};

module.exports = connectDB;
