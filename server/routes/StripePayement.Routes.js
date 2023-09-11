const router = require('express').Router()
const productCtrl = require('../controllers/StripePayementCtrl')


router.route('/')
    .post(productCtrl.payementStripe)


module.exports = router