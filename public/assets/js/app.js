$(document).ready(function() {

//var models = require("./models");

//===========================//
// Article Display Functions //
//===========================//

// Display 20 new articles...
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// On button click, the site displays 20 new scraped articles

var articleContainer = $("#article-container");

function initPage() {
    // Run an AJAX request for any unsaved headlines
    $.get("/articles?saved=false").then(function(data) {
      articleContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        console.log("Problem with rendering articles");
        var alert = $("<h4>Uh Oh. Looks like we don't have any new articles.</h4>");
        articleContainer.append(alert);
      }
    });
  }

function renderArticles(Article) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < Article.length; i++) {
      articleCards.push(createCard(Article[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }

function createCard(Article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", Article.link)
          .text(Article.headline),
        $("<a class='btn btn-success save'><i class='fas fa-heart'></i> Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(Article.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", Article._id);
    // We return the constructed card jQuery element
    return card;
  }

$("#article-scrape-btn").on("click", function() {
    console.log("button was clicked");
    
        $.ajax({
            url: "articles",
            type: "GET",
            success: function(data) {
                console.log(data);
                for(var i = 0; i < 20; i++) {
                    var articleViewTemplate = {
                        "id": data[i]._id,
                        "headline": data[i].headline,
                        "summary": data[i].summary,
                        "link": data[i].link
                    }
                    initPage();
                    console.log("Scraped and Loaded.");
                }
            }
        });
    // Each scraped article will be saved to the app's db.
        // If no duplicate articles...
        //db.articles.insert({})

    // On button click, the site saves the chosen article to saved db
        // sorted by timestamp
});

//========================//
// Article Save Functions //
//========================//

//User clicks the save button to save an article
$(document).on("click", ".save", handleArticleSave);
/*   savedArticles = [];
    $.ajax({
        url:"articles",
        type: "GET",
        success: function(data){
            data=$(data).update("{'_id'='" + data[i]._id + "'}, {$set: {'saved': 'true'}}").then(function() {
                savedArticles.append(data);
            });
            console.log("Save successful");
            //$('#').html($(data));
        }
    })*/


function handleArticleSave() {
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method.
    // Retrieve that to select all of the card data of the article.
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // On save, remove the card from the page.
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/saved" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        initSavedPage();
      }
    });
  }

  function initSavedPage() {
    // Run an AJAX request for any saved headlines
    $.get("/articles?saved=true").then(function(data) {
      articleContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderSavedArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        console.log("Problem with rendering saved articles");
        var alert = $("<h4>Uh Oh. Looks like we don't have any saved articles.</h4>");
        articleContainer.append(alert);
      }
    });
  }

  function renderSavedArticles(data) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < data.length; i++) {
      articleCards.push(createSavedCard(data[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }

function createSavedCard(data) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", data.link)
          .text(data.headline),
        $("<a class='btn btn-success save'><i class='fas fa-heart'></i> Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(data.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", data._id);
    // We return the constructed card jQuery element
    return card;
  }

//======================//
// User Notes Functions //
//======================//

// All users can see all stored articles and comments.

// Users can unsave any "saved" articles.

// Users will be able to leave comments on the "saved" articles 
// and revisit them later.

// Comments are saved to the db & associated with their articles.

// Users can delete comments left on articles.

});