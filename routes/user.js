const express = require('express')
const user = require('../controllers/user')

const user = express.Router()
user.get('/', user.getAll(req, res))
user.get('/:id', user.get(req, res))
user.put('/:id', user.update(req, res))
user.delete('/:id', user.delete(req, res))

module.exports = user
