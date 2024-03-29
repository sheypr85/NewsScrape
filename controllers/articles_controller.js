var express = require('express');

var router = express.Router();

var Article = require('../models/Article.js');

var Note = require('../models/Note')

router.get("/", function (req, res) {
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

  router.delete("/notes/:id", function(req, res) {
    Note.deleteOne({_id: req.params.id})
      .then(function(data) {
         res.json(data)
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  router.delete("/articles/:id", function(req, res) {
    Article.deleteOne({_id: req.params.id})
      .then(function(data) {
         res.json(data)
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  router.delete("/articles/", function(req, res) {
      Article.collection.drop()
      .then(function(result) {
         res.json(result)
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  

module.exports = router;