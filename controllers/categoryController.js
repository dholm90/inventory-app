const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require("express-validator");


// Display list of all categories.
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_list", {
        title: "Category List",
        category_list: list_categories,
      });
    });
};

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.render('category_form', { title: 'Create Category' });
};

// Handle category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];


// Display category delete form on GET.
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      categories_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/categories");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_items: results.categories_items,
      });
    }
  );
};

// Handle category delete on POST.
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      categories_items(callback) {
        Item.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.categories_items.length > 0) {
        // category has items. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_items: results.categories_items,
        });
        return;
      }
      // category has no items. Delete object and redirect to the list of categories.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to category list
        res.redirect("/categories");
      });
    }
  );
};


// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};