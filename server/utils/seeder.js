require("dotenv").config();
// CONNECT BDD
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);
// MODELS
const Product = require('../models/Offer');
// UTILS ASSETS DATAS JSON
const products = require('./assets/data/json/dataOffers.json');



const seedOffers = async () => {
    try {

        await Product.deleteMany();
        console.log('Annonces supprimées');

        await Product.insertMany(products)
        console.log('Annonces ajoutées.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedOffers()