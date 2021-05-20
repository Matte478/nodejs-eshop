const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((err) => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId

  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.findAll().then((products) => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => parseFloat(prod.id) === parseFloat(product.id),
        )
        if (cartProductData) {
          const qty = cartProductData.qty
          cartProducts.push({ productData: product, qty: qty })
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findByPk(productId, (product) => {
    Cart.addProduct(productId, product.price)
  })

  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId

  Product.findByPk(productId, (product) => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}
