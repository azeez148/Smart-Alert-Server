const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db
var admin = require("firebase-admin");

var serviceAccount = require("D:/Server/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

MongoClient.connect('mongodb://zellwk:zellwk@ds047955.mongolab.com:47955/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  });
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  });
});

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  });
});

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  });
});

app.get('/fcmsend', (req, res) => {

// The topic name can be optionally prefixed with "/topics/".
var topic = "smart-alert";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
   notification: {
    title: "From serverrrrr Hiii",
    body: "lalallalla."
  }
};

// Send a message to devices subscribed to the provided topic.
admin.messaging().sendToTopic(topic, payload)
  .then(function(response) {
    // See the MessagingTopicResponse reference documentation for the
    // contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });

   res.send('Inside fcmmm');
});