const mongoose = require("mongoose");

exports.connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.log("connectDb", err);
    }
};
