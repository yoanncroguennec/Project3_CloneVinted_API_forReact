const mongoose = require("mongoose");

// {
//     "email": "test@gmail.com",
//     "username": "yoyo",
//     "newsletter": true,
//     "password": "jjjj"
// }

const UserModel = mongoose.model("User", {
  email: {
    type: String,
    unique: true,
  },
  account: {
    username: {
      type: String,
      required: true,
    },
    // avatar: Object, // On verra plus tard
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = UserModel;
