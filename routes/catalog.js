var express = require('express');
var router = express.Router();

// Require controller modules
var product_controller = require('../controllers/productController');
var productInstance_controller = require('../controllers/productInstanceController');
var brand_controller = require('../controllers/brandController');
var tag_controller = require('../controllers/tagController');

// PRODUCT ROUTES //

// GET catalog home page
router.get('/', product_controller.index);

// Get request for creating a book.
// Note:  this must come BEFORE routes that display Product (uses id).
router.get('/product/create', product_controller.product_create_get);

// POST request for creating Product.
router.post('/product/create', product_controller.product_create_post);

// GET request for deleting Product.
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request for deleting Product.
router.post('/product/:id/delete', product_controller.product_delete_post);

// GET request to update Product.
router.get('/product/:id/update', product_controller.product_update_get);

// POST request to update Product.
router.post('/product/:id/update', product_controller.product_update_post);

// GET request for ONE Product
router.get('/product/:id', product_controller.product_detail);

// GET request for list of all Product items
router.get('/products', product_controller.product_list);

// BRAND ROUTES //

// GET request for creating Brand
// Note:  this must come before route for id (i.e. display brand).
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating Brand
router.post('/brand/create', brand_controller.brand_create_post);

// GET request to delete Brand
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request to delete Brand
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request to update Brand
router.get('/brand/:id/update', brand_controller.brand_update_get);

// POST request to update Brand
router.post('/brand/:id/update', brand_controller.brand_update_post);

// GET request for ONE Brand
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for list of all Brands
router.get('/brands', brand_controller.brand_list);


// TAG ROUTES //

// GET request for creating a Tag
// Note:  this must come before route that displays Tag (uses id)
router.get('/tag/create', tag_controller.tag_create_get);

// POST request for creating a Tag
router.post('/tag/create', tag_controller.tag_create_post);

// GET request for deleting a Tag
router.get('/tag/:id/delete', tag_controller.tag_delete_get);

// POST request for deleting a Tag
router.post('/tag/:id/delete', tag_controller.tag_delete_post);

// GET request for updating a Tag
router.get('/tag/:id/update', tag_controller.tag_update_get);

// POST request for updating a Tag
router.post('/tag/:id/update', tag_controller.tag_update_post);

// GET request for ONE Tag
router.get('/tag/:id', tag_controller.tag_detail);

// GET request for list of all Tags
router.get('/tags', tag_controller.tag_list);


// PRODUCT-INSTANCE ROUTES //

// GET request for creating a ProductInstance
// Note:  this must come before route that displays ProductInstance
router.get('/productInstance/create', productInstance_controller.productInstance_create_get);

// POST request for creating a ProductInstance
router.post('/productInstance/create', productInstance_controller.productInstance_create_post);

// GET request for deleting a ProductInstance
router.get('/productInstance/:id/delete', productInstance_controller.productInstance_delete_get);

// POST request for deleting a ProductInstance
router.post('/productInstance/:id/delete', productInstance_controller.productInstance_delete_post);

// GET request for updating a ProductInstance
router.get('/productInstance/:id/update', productInstance_controller.productInstance_update_get);

// POST request for updating a ProductInstance
router.post('/productInstnace/:id/update', productInstance_controller.productInstance_update_post);

// GET request for ONE ProductInstance
router.get('/productInstance/:id', productInstance_controller.productInstance_detail);

// POST request for list of all ProductInstances
router.get('/productInstances', productInstance_controller.productInstance_list);


module.exports = router;