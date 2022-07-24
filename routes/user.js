const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const auth = require('../auth/auth')
const checkAdmin = require('../auth/checkAdmin')

// import validator
const checkSignUp = require('./validator/checkSignUp')
const checkSignIn = require('./validator/checkSignIn')
const checkSetTypeUser = require('./validator/checkSetTypeUser')
const checkServices = require('./validator/checkServices')

// [GET] /api/outapi/sign-up
router.get('/sign-up', checkSignUp, UserController.signUp)
// [GET] /api/outapi/sign-in
router.get('/sign-in', checkSignIn, UserController.signIn)
// [POST] /api/outapi/settypeaccount
router.post('/settypeaccount', auth, checkAdmin, checkSetTypeUser, UserController.settypeaccount)
// [GET] /api/outapi/deposit
router.get('/deposit', auth, checkServices, checkAdmin,UserController.deposit)

// [GET] /api/outapi/withdraw
router.get('/withdraw', auth, checkServices, checkAdmin, UserController.withdraw)
module.exports = router