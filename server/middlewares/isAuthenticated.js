// "req." : Est un objet.
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // console.log("ok middleware : isAuthenticated");

    // Affichera le mot "Bearer " avant le "Token"
    //   console.log(req.headers.authorization);

    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // N'affichera le mot "Bearer " avant le "Token"
    // Attention ! Ne pas oublier l'espace devant "Bearer "
    // console.log(req.headers.authorization.replace("Bearer ", ""));
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

    // Banc de Test "const user"
    // const user = {
    //   name: "yoyo",
    //   email: "yoyo@gmail.com",
    //   token :"untoken"
    // }
    const user = await User.findOne({ token: token })
      // Je veux que les clés "account" et "_id" apparaissent, laisser un espace entre les noms des keys
      .select("account _id");
    // console.log(user);

    // Si user n'existe pas
    if (!user) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
