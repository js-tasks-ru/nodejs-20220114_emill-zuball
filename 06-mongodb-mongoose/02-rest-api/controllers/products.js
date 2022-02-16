const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {products: products.map(mapProduct) || []};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  try {
    const product = await Product.findOne({_id: ctx.params.id});

    if (product) {
      ctx.body = {product: mapProduct(product)};
    } else {
      ctx.status = 404;
      ctx.body = 'No product';
    }
  } catch (err) {
    if (err.name === 'CastError') {
      ctx.status = 400;
    } else {
      throw err;
    }
  }
};

