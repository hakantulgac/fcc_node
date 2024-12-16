require('dotenv').config();
const mongoose = require("mongoose");
const {Schema,model} = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//JgXNpFPAJzOBltfH
let Person;

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: { type: Number },
  favoriteFoods : { type: [String]}
});

Person = model("Person", personSchema);

const createAndSavePerson = (done) => {

  let newPerson = new Person({
    name: "hakan",
    age: 24,
    favoriteFoods: ["pizza", "icecream"]
  });

  newPerson.save((err, data)=>{
    if(err){
      done(err)
    }else{
      done(null, data);
    }
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople)
    .then((data)=>{
      done(null, data)
    }).catch((err)=>{
      done(err);
    })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data)=>{
    if(err){
      done(err);
    }else{
      done(null, data);
    }
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data)=>{
    if(err){
      done(err);
    }else{
      done(null, data);
    }
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data)=>{
    if(err){
      done(err);
    }else{
      done(null, data);
    }
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, data)=>{
    if(err){
      done(err);
    }else{
      data.favoriteFoods.push(foodToAdd);
      data.save((err, _data)=>{
        err ? done(err) : done(null, _data);
      });
    }
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName},{$set: {age: ageToSet}}, (err, data)=>{
    if(err){
      done(err);
    }else{
      done(null, data);
    }
})
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data)=>{
    err ? done(err): done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, data)=>{
    err ? done(err): done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
