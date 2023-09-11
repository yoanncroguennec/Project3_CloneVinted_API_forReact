const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        titleOffer: String,
        date: Date,
        itemPrice: Number,
        taxPrice: Number,
        totalPrice: Number
});

module.exports = Order;