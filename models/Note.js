var mongoose = require("mongoose");

//=============================//
// Schema for notes collection //
//=============================//
var Schema = mongoose.Schema;

//Use a Schema constructor to create a new schema for each Note
//in the notes collection (MongoDB)
var NoteSchema = new Schema({
        type: String,
        //Each new article starts with 0 notes
        required: false
});

// Use mongoose to create a model called `Note` 
// using the NoteSchema, and store it in a variable. 
var Note = mongoose.model("Note", NoteSchema);

//This will be exported by index.js
module.exports = Note;