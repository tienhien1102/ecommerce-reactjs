const express = require('express')
const router = express.Router()
const { userSingupValidator } = require("../validator")
const { signup, signin, signout, requireSignin } = require('../controllers/auth')

router.post('/signup', userSingupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)


module.exports = router;