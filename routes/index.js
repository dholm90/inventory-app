var express = require('express');
var router = express.Router();

// Require Controller Modules
const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

// ITEM ROUTES

/* GET home page. */
router.get('/', item_controller.index);

// GET request for creating an item
router.get('/item/create', item_controller.item_create_get);

// POSt request for creating item
router.post('/item/create', item_controller.item_create_post);

// get request for delete item
router.get('/item/:id/delete', item_controller.item_delete_get);

// post request for delete item
router.post('/item/:id/delete', item_controller.item_delete_post);

// get request to update item
router.get('/item/:id/update', item_controller.item_update_get);

// post request to update item
router.post('/item/:id/update', item_controller.item_update_post);

// get request for one item
router.get('/item/:id', item_controller.item_detail);

// get request for list of all items
router.get('/items', item_controller.item_list);

// CATEGORY ROUTES

// get request for creating category
router.get('/category/create', category_controller.category_create_get);

// post request for creating category
router.post('/category/create', category_controller.category_create_post);

// get request to delete category
router.get('/category/:id/delete', category_controller.category_delete_get);

// post request to delete category
router.post('/category/:id/delete', category_controller.category_delete_post);

// get request to update category
router.get('/category:id/update', category_controller.category_update_get);

// post request to update category
router.post('/category/:id/update', category_controller.category_update_post);

// get request for one category
router.get('/category/:id', category_controller.category_detail);

// get request for list of all category
router.get('/categories', category_controller.category_list);

module.exports = router;
