const app = require("./app/app");
require("dotenv").config()

//  MONGODB
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

//  CLOUDINARY
//  Attention ! Marquer `.v2`, étant la clé ".v2" du package "cloudinary"
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// RUN SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started 🧦 ${PORT}`);
});
