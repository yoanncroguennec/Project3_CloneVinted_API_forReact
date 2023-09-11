const router = require('express').Router()
const authCtrl = require('../controllers/AuthCtrl')

router.post("/signup", authCtrl.signup)
router.post("/login", authCtrl.login)

// router.delete("/fkjezejf", () => {});

module.exports = router;
