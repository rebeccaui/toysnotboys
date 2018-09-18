//================//
//  Dependencies  //
//================//

var express = require("express");
var expresshb = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();
//===============//
//  Connections  //
//===============//

// Set mongoose to leverage built in JavaScript ES6 Promises
// This code should connect mongoose to your remote mongolab database if deployed, 
// but otherwise will connect to the local mongoHeadlines database on your computer.
// Connect the remote's URI to mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, function() {
    console.log("Successful connection between remote and mongoose.")
});


//====================//
// Scraping Functions //
//====================//

// Scrape from NY Times...
// Headline - the title of the article
// Summary - a short summary of the article
// URL - the url to the original article


//==========//
//  Routes  //
//==========//

/*
// Html Routes

// Homepage Route
app.get("/") {

}

app.get("/index") {

}
// Saved Articles Route
app.get("/saved") {

}
*/