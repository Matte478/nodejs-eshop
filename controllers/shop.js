const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((err) => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId

  Product.findById(productId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
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
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price)
  })

  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId

  Product.findById(productId, (product) => {
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
