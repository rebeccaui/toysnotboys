$(document).ready(function() {

var models = require("./models");

//===========================//
// Article Display Functions //
//===========================//

// Display 20 new articles...
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var articleTemplateScript = $("#article-template").html();

//Compile the template javascript above
var articleTemplateCompiler = Handlebars.compile(articleTemplateScript);

//Define that data object to be passed to the compiled template
var context = {
    "headline": Article.headline,
    "summary": Article.summary,
    "link": Article.link
};

//???Variable that holds the compiled data 
var compiledArticle = articleTemplateCompiler(context);

// On button click, the site displays 20 new scraped articles
// sorted by date and time
$("button").on("click", function() {
    app.get("/scrape", function(req, res) {
        
    })
    // Each scraped article will be saved to the app's db.
        // If no duplicate articles...
        //db.articles.insert({})

    // On button click, the site saves the chosen article to saved db
        // sorted by timestamp

})
$("#articles-container").append(compiledArticle);




//======================//
// User Notes Functions //
//======================//

// All users can see all stored articles and comments.

// Users can unsave any "saved" articles

// Users will be able to leave comments on the "saved" articles 
// and revisit them later.

// Comments are saved to the db & associated with their articles.

// Users can delete comments left on articles.

});