const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')
const productsController = require('../controllers/shop')

const router = express.Router()

// router.get('/products', productsController.getAdminProducts)
router.get('/products', adminController.getProducts)

router.get('/add-product', adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

module.exports = router
