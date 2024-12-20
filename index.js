const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const {MongoClient, ObjectId} = require("mongodb");
const client = new MongoClient(process.env.DB_URL);

const db = client.db("test");
const people = db.collection("people");
const exercises = db.collection("exercises");

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
    
app.post('/api/users/:_id/exercises', async (req, res) => {
  let {_id} = req.params
  let {description, duration, date} = req.body;

  if(description && duration && _id){
    date = date ? new Date(date).toDateString() : new Date().toDateString();
    _id = new ObjectId(_id);
    duration = Number(duration);

    const {username} = await people.findOne({_id});
    await exercises.insertOne({userId: _id, username, date, duration, description})

    res.json({_id, username, date, duration, description})
  }else{
    res.send("error");
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = new ObjectId(req.params._id);
  const exercisesForUser = await exercises.find({userId}).toArray();
  res.json({
    _id: exercisesForUser[0].userId,
    username: exercisesForUser[0].username,
    count: exercisesForUser.length,
    log: exercisesForUser.map(i=>({
      description: i.description,
      duration: i.duration,
      date: i.date
    }))
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})