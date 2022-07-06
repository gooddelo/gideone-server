const express = require('express')
const router = express.Router()
const company = require('../controllers/company')
const data = require('../controllers/data')

router.post('/', company.create(req, res))
router.get('/', company.get(req, res))
router.get('/:id', company.get(req, res))
router.put('/:id', company.update(req, res))
router.delete('/:id', company.delete(req, res))

router.post('/:conpany/data', data.create(req, res))
router.get('/:conpany/data', data.get(req, res))

module.exports = router
