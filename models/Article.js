var mongoose = require("mongoose");

//================================//
// Schema for articles collection //
//================================//

var Schema = mongoose.Schema;

// Use a Schema constructor to create a new schema for each article
// in the articles collection (MongoDB)
    // headline, summary, link to the original article

var ArticleSchema = new Schema ({
    headline : {
        type: String,
        required: true
    },
    summary : {
        type: String,
        required: true
    },
    link : {
        type: String,
        required: true
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Use mongoose to create a model called `Article` 
// using the ArticleSchema, and store it in a variable. 
var Article = mongoose.model("Article", ArticleSchema);

//This will be exported by index.js
module.exports = Article;