// Dependencies
var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
// app.use(express.static("public"));
mongoose.connect("mongodb://localhost/NewsScraper", { useNewUrlParser: true });


// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.cnet.com/news/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var collection = $("div.fdListingContainer div.col-8.fdListing").children("div.row").find("div.riverPost")

        // filter out to only riverPost
        $(collection).each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("div.col-5.assetText h3 a")
                .text().trim();

            result.summary = $(this)
                .find("div.col-5.assetText p a")
                .text().trim();

            result.link = "https://www.cnet.com" + $(this)
                .find("div.col-5.assetText h3 a").attr("href");

            result.picture = $(this)
                .find("div.col-2.assetThumb a figure.img span img").attr("data-original")


            console.log(result)

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});