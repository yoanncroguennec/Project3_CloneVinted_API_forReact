const stripe = require("stripe")(
  "sk_test_51IMB74DCutNgHcFWxYlXkBZcCYUkBKkIUkPtL0l7kuptoUUhfb08Iw5rgaXeCjbJwbemiWkry5oEN3TpnGGuXAJ000lNhFvdsv"
);

const authCtrl = {
    payementStripe: async (req, res, next) => {
        try {
            // console.log(req.body);
            // Reçois un token du front
            const stripeToken = req.body.stripeToken;
            // Requête à stripe pour créer un paiement
            const responseFromStripe = await stripe.charges.create({
                amount: 150,
                currency: "eur",
                description: "La description de l'objet acheté",
                source: stripeToken,
            });
            // Si le paiement est effectué, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé
            console.log(responseFromStripe);
            // Je renvoie au client le status de la réponse de stripe
            res.json(responseFromStripe.status);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
}

module.exports = authCtrl