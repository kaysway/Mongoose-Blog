'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
      type: 'string',
      unique: true
  }
});

let commentSchema = mongoose.Schema({ content: 'string' });

let blogSchema = mongoose.Schema({
    author: {
      firstName: String,
      lastName: String
    },
    title: {type: String, required: true},
    content: {type: String},
    created: {type: Date, default: Date.now}
  });

  blogPostSchema.pre('find', function(next){
    this.populate('author');
    next();
  });

  blogPostSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
  });

  blogPostSchema.virtual('authorName').get(function() {
    return `${this.author.firstName}`.trim();
  });

  blogPostSchema.methods.serialize = function() {
    return {
      id: this._id,
      author: this.authorName,
      content: this.content,
      title: this.title,
      comments: this.comments
    };
  };

  let Author = mongoose.model('Author', authorSchema);
  const BlogPost = mongoose.model('BlogPost', blogPostSchema);

  module.exports = {Author, BlogPost};

