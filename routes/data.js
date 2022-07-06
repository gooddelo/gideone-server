const express = require('express')
const router = express.Router()
const data = require('../controllers/data')

router.get('/:id', data.get(req, res))
router.put('/:id', data.update(req, res))
router.delete('/:id', data.delete(req, res))

module.exports = router
