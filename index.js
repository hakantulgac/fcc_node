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
  const limit = Number(req.query.limit);
  const {from, to} = req.query;

  let exercisesForUser = await exercises.find({userId}).toArray();

  const dateRangedExercise = from && to ? exercisesForUser.filter(i => new Date(from) < new Date(i.date) && new Date(to) > new Date (i.date)) : exercisesForUser
  const limitedExercise = limit ? dateRangedExercise.filter((item, i)=>i<limit) : dateRangedExercise;

  res.json({
    _id: limitedExercise[0].userId,
    username: limitedExercise[0].username,
    count: limitedExercise.length,
    log: limitedExercise.map(i=>({
      description: i.description,
      duration: i.duration,
      date: i.date
    }))
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})