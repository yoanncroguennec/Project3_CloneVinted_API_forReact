const express = require("express");
const cors = require("cors");
// "express-fileupload" : Pour réceptionner des Datas
const fileUpload = require("express-fileupload");
// On remarque la présence de `.v2` ici 👇
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());
app.use(cors());

// app.use("/api/payment", require("../server/routes/StripePayement.Routes"));

// Routes
app.get("/", (req, res) => {
  res.json("Bienvenue sur mon serveur");
});

// ROUTE UPLOAD + UPLOAD IMG CLOUDINARY
const isAuthenticated = require("../server/middlewares/isAuthenticated");
const convertToBase64 = (file) => {
  // return une chaîne de caractère
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
// "fileUpload" : "middleware" dans la route `/upload`
app.post("/api/upload", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    //  "console.log" : récupère/affiche les fichiers reçus ("name" du fichier, "data" : le buffer du fichier, "size" poids du fichier, "mimetype" type de fichier", "md5" identifiant unique du fichier)
    //  "buffer" : Représentation du fichier dans sa version brute, peut pas être directement utilisé pour être affiché, sert de fichier temporaire pour être manipulé. Ne peut pas directement envoyer un buffer à Cloudinary. Nous devons transformer le buffer en base64 (format pour Cloudinary, chaîne de caractères contenant des infos du contenu d'un fichier, ressemble à ça : data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAACKCAYAAADi+rf7AAAK22lDQ1BJQ0MgUHJvZmlsZQAASImVlwdUk1kWgN//pzdKEhCQEmoognQCSAmhhd6bqIQkkFBiDAQUOzI4gmNBRQTUARVFFBwdARkLYsE2KDbsE2RQU).
    //  Décryption : Le vocable data; Le "mimetype": type de fichier (image/jpeg), suivi d'un point-virgule; Le vocable base64, suivi d'une virgule; Le contenu du fichier.
    //  console.log(req.body);
    //  console.log(req.files);

    const pictureToUpload = req.files.picture;

    //  On envoie une à Cloudinary un buffer converti en base64
    //  console.log(convertToBase64(req.files.pictures));
    const result = await cloudinary.uploader.upload(
      convertToBase64(pictureToUpload)
    );
    return res.json(result);

    // res.send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// OTHERS ROUTES
app.get("/ddd", (req, res) => {
  res.status(400).json({ message: "test" });
});

app.use("/api/auth", require("../server/routes/Auth.Routes"));
app.use("/api/offers", require("../server/routes/Offers.Routes"));

// ROUTES UNDEFINED
app.all("*", (req, res) => {
  res.status(404).json({ message: "Cette route n'existe pas" });
});


module.exports = app;
