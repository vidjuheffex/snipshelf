const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SnippetSchema = new Schema({
  title: {
    type: String,
    required: true 
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  document: {
    type: String
  },
  language: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  }
});

module.exports = mongoose.model("Snippet", SnippetSchema);
