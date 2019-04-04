var express = require('express');

var router = express.Router();

var Article = require('../models/Article.js');

var Note = require('../models/Note')

router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    Article.find({})
        .then(function (data) {
            let hbsObject = {
                articles: data,
              };
              console.log(hbsObject);
              res.render('index', hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.get("/articles/new", function (req, res) {
    // Grab every document in the Articles collection
    Article.find({ saved:false})
        .then(function (data) {
            let hbsObject = {
                saved: false,
                articles: data
              };
              console.log(hbsObject);
              res.render('index', hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.get("/articles/saved", function (req, res) {
    // Grab every document in the Articles collection
    Article.find({ saved:true})
    .populate("notes")
        .then(function (data) {
            let hbsObject = {
                saved: true,
                articles: data
              };
              console.log(hbsObject);
              res.render('index', hbsObject);
            // res.json(hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.get("/articles/:id", function (req, res) {
    // Grab every document in the Articles collection
    Article.findOne({ _id: req.params.id })
        .then(function (data) {
            let hbsObject = {
                articles: data,
              };
              console.log(hbsObject);
              res.json(hbsObject);
            //   res.render('index', hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



router.put("/articles/:id", function (req, res) {
    // Grab every document in the Articles collection
    Article.findOneAndUpdate({ _id: req.params.id }, {$set:{saved:true}}, {new:true})
        .then(function (data) {
            let hbsObject = {
                articles: data,
              };
              res.json(hbsObject);
              console.log(hbsObject);
            //   res.render('index', hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
        Note.create(req.body)
      .then(function(dbNote) {
        return Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  router.get("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
        Note.create(req.body)
      .then(function(dbNote) {
        return Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


module.exports = router;