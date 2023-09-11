const router = require('express').Router()
// "express-fileupload" : Permet de récupérer les fichiers transmis par les clients
const fileUpload = require("express-fileupload");
// MIDDLEWARES
const isAuthenticated = require("../middlewares/isAuthenticated");
// CONTROLLERS
const offerCtrl = require("../controllers/OfferCtrl");

// router.get("/", (req, res) => {
//   res.status(400).json({ message: "test" });
// });



router
  .route("/")
  // Version without the middleware "isAuthenticated"
  // .post(fileUpload(), productCtrl.createOffer)
  // Version with the middleware "isAuthenticated"
  .post(isAuthenticated, fileUpload(), offerCtrl.createOffer)
  .get(offerCtrl.getAllOffers);

// // router.route('/:id')
// //     .get(productCtrl.getOffer)

module.exports = router