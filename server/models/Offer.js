const mongoose = require("mongoose");

const OfferModel = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  owner: {
    // Une clé "owner" : De type "ObjectId", faisant référence au model "UserModel"
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
});

module.exports = OfferModel;
