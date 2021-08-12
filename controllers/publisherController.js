const { body,validationResult } = require("express-validator");

var mongoose = require('mongoose');

var Publisher = require('../models/publisher');
var Book = require('../models/book');
var async = require('async');


// Display list of all publishers.
exports.publisher_list = function(req, res, next) {

    Publisher.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_publishers) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('publisher_list', { title: 'Publisher List', publisher_list: list_publishers });
      });
  
  };

// Display detail page for a specific Publisher.
exports.publisher_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        publisher: function(callback) {
            Publisher.findById(req.params.id)
              .exec(callback);
        },

        publisher_books: function(callback) {
            Book.find({ 'publisher': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.publisher==null) { // No results.
            var err = new Error('Publisher not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('publisher_detail', { title: 'Publisher Detail', publisher: results.publisher, publisher_books: results.publisher_books } );
    });

};


// Display Publisher create form on GET.
exports.publisher_create_get = function(req, res) {
    res.render('publisher_form', { title: 'Create Publisher' });
};

// Handle Publisher create on POST.
exports.publisher_create_post =  [

    // Validate and santize the name field.
    body('name', 'Publisher name required').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a publisher object with escaped and trimmed data.
      var publisher = new Publisher(
        { name: req.body.name }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('publisher_form', { title: 'Create Publisher', publisher: publisher, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Publisher with same name already exists.
        Publisher.findOne({ 'name': req.body.name })
          .exec( function(err, found_publisher) {
             if (err) { return next(err); }
  
             if (found_publisher) {
               // Publisher exists, redirect to its detail page.
               res.redirect(found_publisher.url);
             }
             else {
  
               publisher.save(function (err) {
                 if (err) { return next(err); }
                 // Publisher saved. Redirect to publisher detail page.
                 res.redirect(publisher.url);
               });
  
             }
  
           });
      }
    }
  ];

// Display Publisher delete form on GET.
exports.publisher_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Publisher delete GET');
};

// Handle Publisher delete on POST.
exports.publisher_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Publisher delete POST');
};

// Display Publisher update form on GET.
exports.publisher_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Publisher update GET');
};

// Handle Publisher update on POST.
exports.publisher_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Publisher update POST');
};
