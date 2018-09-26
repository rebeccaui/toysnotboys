//================//
//  Dependencies  //
//================//

var express = require("express");
var path = require("path");
var expresshb = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require("request");
var logger = require("morgan");
var exphbs = require("express-handlebars");

// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

// models are required to sync them
var db = require("./models");

//var routes = require("./controllers/app_controller.js");

//==================//
//  Configurations  //
//==================//

// Express
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//app.use(express.json());

// sets the port info
// app.set('PORT', (process.env.PORT || 8080));
var PORT = 8080;
// morgan logger for configuring logging requests
app.use(logger("dev"));

// Middleware
//>>>>>>>>>>>>>>>>>>>>>>>>>>>

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static folders
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/public/assets/img')); 


// Mongoose
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// This code should connect mongoose to your remote mongolab database if deployed, 
// but otherwise will connect to the local mongoHeadlines database on your computer.
mongoose.Promise = Promise;

// Connect the remote's URI to mongoose
mongoose.connect(MONGODB_URI, function() {
    console.log("Successful connection between remote and mongoose.")
});


// Handlebars
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//=============================//
// Routes & Scraping Functions //
//=============================//

// Scrape from NY Times...
    // Headline - the title of the article
    // Summary - a short summary of the article
    // Link - the url to the original article


// Import routes and give the server access to them.
    //app.use(routes);

// Html Routes

// Homepage Route
app.get("/", function(req, res) {
    res.render("index");
});

app.get("/scrape", function(req, res) {

    // Make a request call to grab the HTML body from the site of your choice
    request("https://www.autostraddle.com/tag/autostraddle-anonymous-sex-toy-review/", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var results = {};

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("article").each(function(i, element) {
            results = {};
            results.headline = $(element).find("h1").text();
            results.link = $(element).find("a").attr("href");
            results.summary = $(element).find("p").text();
            // console.log(results);
            // Save these results in an object that we'll push into the results array we defined earlier

            db.Article.create(results)
            .then(function(newArticle) {
            console.log( "NEW ARTICLE: " + newArticle);  
            })
            .catch(function(err) {
                console.log(err);
            });
            //res.send("scraping was successful.");
        });
        // Log the results once you've looped through each of the elements found with cheerio
        //console.log(results);
        res.send(results);
    });
});

app.get("/saved", function(req,res) {
    res.render("saved");
})

//View articles
app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(newArticle) {
        //console.log(newArticle);
        res.json(newArticle);
        //mongooseResponse.json(newArticle);
    })
    .catch(function(err) {
        console.log(err);
    });
});

// Get a specific article
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note").then(function(newArticle) {
        res.json(newArticle);
    }).catch(function(err) {
        res.json(err);
    })
});


/*
app.get("/nyt", function(req, res) {
    request("https://www.nytimes.com/", function(err, response, html) {
        var $ = cheerio.load(response.data);
        var result = {};

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
            result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                //.find("a") //h2
                .children(".balancedHeadline") //span
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            console.log(response.data);
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    //console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
            });
        });
    }).then(function(response) {
        
    
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});
*/

/*
// Saved Articles Route
app.get("/saved") {

}
*/
app.listen(PORT, function() {
    console.log("App listening on port: " + PORT);
});