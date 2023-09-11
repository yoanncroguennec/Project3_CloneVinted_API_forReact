// RegExp : Permet de chercher si certains éléments sont présent (Ex: Présence du "@" dans l'email) / Cours "Le Réacteur" à 10min de la vidéo "Cours sur les Filters", catégorie "Back", Jour 6
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../utils/convertToBase64");
// MODEL
const OfferModel = require("../models/Offer");

const offerCtrl = {
  ///////////////////
  //// CREATE OFFER ////
  ///////////////////
  createOffer: async (req, res, next) => {
    // Selectionnez body "form-data" et nom "raw" sur Postman, car on peut pas renvoyer en raw des fichiers (photos, documents, etc...)
    try {
      //  console.log(req.user);

      //  console.log(req.body);
      // "req.files" : A rajoutez si on a envoyé des fichiers via "Postman" => Onglet : "Body" => Selection "form-data"
      //  console.log(req.files);

      // Destructuring de la requête
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newOffer = new OfferModel({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        // Attention ! On rajoute "owner: req.user", que si on a rajouter le middleware "isAuthenticated", sur la route, dans le dossier "routes", sion on commente  "owner: req.user"
        owner: req.user,
      });
      //   console.log(newOffer);

      // PARTIE CLOUDINARY
      const result = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );
      //   console.log(result);

      // key "product_image" qui contiendra "result"
      newOffer.product_image = result;

      await newOffer.save();
      res.json(newOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  ///////////////////////
  //// GET ALL OFFER ////
  ///////////////////////
  getAllOffers: async (req, res, next) => {
    try {
      //////////////////////////////////
      //// FIRST EXEMPLE WITH REGEX ////
      //////////////////////////////////

      // const regexp = /T-shirt/i; // OR // const regexp = ("Bleu", "i");
      // const offers = await OfferModel.find({ product_name: regexp})
      // "".select" : Que pour le coté "dev", afin de renvoyer juste deux keys "product_price" & "product_name", et a noter "-_id" le moins indiquer d'enlever la key "_id"
      // .select("product_price product_name -_id");
      // res.json(offers);

      //////////////////////////////////////
      //// SECOND EXEMPLE WITHOUT REGEX ////
      //////////////////////////////////////
      const { title, priceMin, priceMax, sort, page } = req.query;

      // FILTER PRICE
      // Create an empty object
      let filters = {};
      // Si je reçois title, je rajoute une key product_name à mon Objet (filters) qui contiendra une nouvelle "RegExp" "i" => Pas sensible à la Case
      if (title) {
        filters.product_name = new RegExp(title, "i");
      }

      //// FILTER WITH PRICE ////
      //// Find avec fourchette de prix
      // "$lte" = inférieur ou égal /// OR /// "$gte" = supérieur ou égal /// OR /// "$lt" or "gt" =  "strictement inférieur" or "strictement supérieur"

      // const offers = await OfferModel.find({ $gte: 50, $lte: 150 // Entre "50" et "150" })
      // .select("product_price product_name -_id");
      // res.json(offers);

      ////
      // Number(priceMin) : Sécurisé de manière à convertir en nombre pour être sur qu'il s'agit bien d'un nombre
      if (priceMin) {
        // "$gte" = plus grand que ou égal
        // Number(priceMin) : Sécurisé de manière à convertir en nombre pour être sur qu'il s'agit bien d'un nombre
        filters.product_price = { $gte: Number(priceMin) };
      }

      // "$lte" = inférieur ou égal
      if (priceMax) {
        if (filters.product_price) {
          filters.product_price.$lte = Number(priceMax);
        } else {
          filters.product_price = { $lte: Number(priceMax) };
        }
      }
      console.log(filters.product_price);

      //////////////////////////////////////
      //////////////////////////////////////
      //////////////////////////////////////

      ///////////////////////////////////////////////
      //// SORT BY DESCENDING OR ASCENDING PRICE ////
      ///////////////////////////////////////////////
      // FIRST VERSION
      // const offers = await OfferModel.find().sort({ product_price: "asc" });
      // res.json(offers);
      // SECOND VERSION
      const sortFilter = {};
      if (sort === "price-asc") {
        sortFilter.product_price = "asc"; // ou 1 ou "ascending"
      } else if (sort === "price-desc") {
        sortFilter.product_price = "desc"; // ou -1 ou "descending"
      }
      // res.json(sortFilter);

      //////////////////////////////////////
      //////////////////////////////////////
      //////////////////////////////////////

      ///////////////////////////////////
      //// PAGINATION : LIMIT & SKIP ////
      ///////////////////////////////////
      //// A NOTER ////
      // LIMIT : Nombre de résultats a envoyer à l'user
      // SKIP : Nombre de résultats que l'on ignore avant de compter ceux que l'on va envoyer à l'user
      ////////////////////
      // FIRST VERSION
      // const offers = await OfferModel.find()
      //   .skip(10) // Ignorer les 10 premiers
      //   .limit(5) // Limiter à 5 résultats
      //   .select("product_price product_name -_id");
      // res.json(offers);

      // SECOND VERSION
      const limit = 5;

      let pageRequired = 1;
      if (page) pageRequired = Number(page);

      const skip = (pageRequired - 1) * limit;

      // Second Step
      const offers = await OfferModel.find(filters)
        .sort(sortFilter)
        .skip(skip)
        .limit(limit)
        .populate("owner", "account");
      // "".select" : Que pour le coté "dev", afin de renvoyer juste deux keys "product_price" & "product_name", et a noter "-_id" le moins indiquer d'enlever la key "_id"
      // .select("product_price product_name -_id");

      // Compte les Docs correspondant au filtre
      const count = await OfferModel.countDocuments(filters);

      const response = {
        count: count,
        offers: offers,
      };

      res.json(response);

      //////////////////////////////////////
      //////////////////////////////////////
      //////////////////////////////////////

      //////////////////////////////////////////////////////////////////////////////////
      //// ON PEUT ENCHAÎNER A LA SUITE "REGEX", "PRICE RANGE", "SORT BY ASCENDANT" ////
      //////////////////////////////////////////////////////////////////////////////////
      // const offers = await OfferModel.find({
      //   product_name: new RegExp("T-shirt", "i"),
      //   product_price: { $gte: 15, $lte: 25 },
      // })
      //   .sort({ product_name: 1 })
      //   .select("product_price product_name -_id");
      // res.json(offers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  ///////////////////
  //// GET OFFER ////
  ///////////////////
  getOffer: async (req, res, next) => {
    try {
      const offer = await OfferModel.findById(req.params.id)
        // "populate()" : Permet de référencer des documents dans d'autres collections
        .populate("owner", "account");

      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = offerCtrl;
