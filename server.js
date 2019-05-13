const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Restaurant} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/posts', (req, res) => {
    BlogPost
      .find()
      .then(posts => {
        res.json(posts.map(post => post.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went wrong' });
      });
  });

  app.get('/posts/:id', (req, res) => {
    BlogPost
      .findById(req.params.id)
      .then(post => res.json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went wrong' });
      });
  });

  app.post('/posts', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    BlogPost
      .create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
      })
      .then(blogPost => res.status(201).json(blogPost.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });

  // app.delete and app.put next....

  //app.delete(){

 // }

 // app.put(){

 // }

  app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  };

  module.exports = { runServer, app, closeServer };
