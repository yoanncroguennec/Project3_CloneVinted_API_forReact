// "uid2" : Generate unique ids. Pass in a length and it returns a string.
const uid2 = require("uid2");
// "crypto-js" :
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
// MODELS
const UserModel = require("../models/User");

const authCtrl = {
  signup: async (req, res, next) => {
    try {
      // body de ma requête
      // console.log(req.body);
      const { username, email, password, newsletter } = req.body;

      // Condition checked missing parameter
      if (!username || !email || !password || typeof newsletter !== "boolean")
        return res.status(400).json({ message: "Paramètre manquant" });

      // Condition checked email used
      const emailAlreadyUsed = await UserModel.findOne({ email });
      if (emailAlreadyUsed)
        return res.status(409).json({ message: "Cet email est déjà utilisé" });

      // Encrypt password
      const token = uid2(64); // Génère Token qui fera 64 caractères de long
      const salt = uid2(16); // Génère Saly qui fera 64 caractères de long
      console.log("token :", token, "salt :", salt);
      // On concatène le "salt" avec le "passord"
      // "encBase64" Donner en argument
      const hash = SHA256(password + salt).toString(encBase64);
      console.log(hash);

      const newUser = new UserModel({
        email: email,
        account: {
          username,
        },
        newsletter: newsletter,
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();

      res.json = {
        _id: newUser._id,
        account: newUser.account,
        token: newUser.token,
      };
      // return res.status(400).json(res);
      // res.json(res);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  ////////
  // LOGIN
  ////////
  login: async (req, res, next) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (user) {
        if (
          // Recréer un hash à partir du salt du user trouvé et du MDP reçu
          SHA256(req.body.password + user.salt).toString(encBase64) ===
          user.hash
        ) {
          res.status(200).json({
            _id: user._id,
            token: user.token,
            account: user.account,
          });
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      } else {
        res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authCtrl;
