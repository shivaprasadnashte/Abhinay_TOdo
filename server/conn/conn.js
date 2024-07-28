const mongoose = require("mongoose");
const conn = async (req, res) => {
  try {
    await mongoose.connect("mongodb+srv://Shivaprasad:Pass123@cluster0.cwxauli.mongodb.net/abhinay?retryWrites=true&w=majority").then(() => {
      console.log("Connected");
    });
  } catch (error) {
    console.log(error);
  }
};
conn();
