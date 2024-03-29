const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const userId = req.user.id

  req.user
    .createProduct({
      title,
      imageUrl,
      price,
      description,
      userId,
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    return res.redirect('/')
  }

  const productId = req.params.productId
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/')
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      })
    })
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  Product.findByPk(productId)
    .then((product) => {
      product.title = updatedTitle
      product.imageUrl = updatedImageUrl
      product.price = updatedPrice
      product.description = updatedDescription

      return product.save()
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId

  Product.findByPk(productId)
    .then((product) => product.destroy())
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
}
