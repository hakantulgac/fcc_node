const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const {MongoClient} = require("mongodb");
const client = new MongoClient(process.env.DB_URL);

const db = client.db("test");
const people = db.collection("people");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
    .get( async (req, res) => {
      const result = await people.find().toArray();
      res.send(result);
    })
    .post( async (req, res) => {
      const {username} = req.body;
      const {insertedId} = await people.insertOne({username});
    
      res.json({username, _id: insertedId})
    })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})