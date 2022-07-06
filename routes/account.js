const express = require('express')
const account = require('../controllers/account')

const register = express.Router()
register.post('/', account.register(req, res))

const login = express.Router()
login.post('/', account.login(req, res))

module.exports = { register, login }
