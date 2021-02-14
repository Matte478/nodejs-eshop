const fs = require('fs')
const path = require('path')

const rootDir = require('../util/path')

const p = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
  static addProduct(id, price) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      }
      if (!err) {
        cart = JSON.parse(fileContent)
      }

      // Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id,
      )
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // add new product / increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty += 1
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }

      cart.totalPrice += +price
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.find(
        (prod) => parseFloat(prod.id) === parseFloat(id),
      )
      if (!product) {
        return
      }
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter(
        (prod) => parseFloat(prod.id) !== parseFloat(id),
      )
      updatedCart.totalPrice -= productPrice * productQty

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) console.log(err)
      })
    })
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        callback(null)
      } else {
        callback(cart)
      }
    })
  }
}
