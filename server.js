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
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/NewsScraper", {
    useNewUrlParser: true
});

var exphbs = require ("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var routes = require("./controllers/articles_controller")

app.use(routes);



// Routes

// A GET route for scraping 
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.cnet.com/news/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var collection = $("div.fdListingContainer div.col-8.fdListing").children("div.row").find("div.riverPost")
        var allArticles = []
        // filter out to only riverPost
        $(collection).each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).find("div.col-5.assetText h3 a").text().trim();
            result.summary = $(this).find("div.col-5.assetText p a").text().trim();
            result.link = "https://www.cnet.com" + $(this).find("div.col-5.assetText h3 a").attr("href");
            result.picture = $(this).find("div.col-2.assetThumb a figure.img span img").attr("data-original")


            console.log(result)
           
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                
                });
        });

        // Send a message to the client
        // res.send("Scrape Complete");
        
    });
    res.redirect('/articles/new');
});



// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);




app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});