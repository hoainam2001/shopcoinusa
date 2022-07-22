const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const auth = require('../auth/auth')

// [GET] /api/outapi/sign-up
router.get('/sign-up', UserController.signUp)
// [GET] /api/outapi/sign-in
router.get('/sign-in', UserController.signIn)
// [POST] /api/outapi/settypeaccount
router.post('/settypeaccount', auth, UserController.settypeaccount)

module.exports = router