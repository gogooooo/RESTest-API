const express = require("express");
const Mongoose = require("mongoose");
const { Schema } = require("mongoose");

const BodyParser = require("body-parser");
const app = express();
// connect to our MongoDB instance running on localhost and create a thepolyglotdeveloper database
Mongoose.connect(
  "mongodb+srv://hager:hager1234@cluster0.jc47e.mongodb.net/person?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, succ) => {
    if (err) console.log(err);
    console.log("connected to DB");
  }
);
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// listening for requests to our application on port 3000

//Our model is person which will create a people collection within our database
//Each document in our collection will have the firstname and lastname properties
const PersonSchema = new Schema({
  firstname: String,
  lastname: String,
});
const PersonModel = Mongoose.model("Person", PersonSchema);

//we have data in our database, we can try to retrieve it
app.get("/person", async (request, response) => {
  try {
    var result = await PersonModel.find();
    response.json(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/person/add", (req, res) => {
  PersonModel.create(req.body, (err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).json(doc);
  });
});

//retrieve a single document based on its stored id value
app.get("/person/:id", async (request, response) => {
  try {
    var person = await PersonModel.findById(request.params.id).exec(); //find a single document based on the associated id
    response.send(person);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update and a Delete endpoint
//Update
app.put("/person/:id", (request, response) => {
  try {
    const filter = { _id: request.params.id };
    const update = request.body;
    PersonModel.findOneAndUpdate(
      filter,
      update,
      {
        useFindAndModify: false,
        new: true,
      },
      (err, doc) => {
        if (err) console.log(err);
        console.log(doc);
        response.send(doc);
      }
    );
  } catch (error) {
    response.status(500).send(error);
  }
});
//Delete
app.delete("/person/:id", (request, response) => {
  try {
    PersonModel.deleteOne({ _id: request.params.id }, (err, result) => {
      if (err) console.log(err);
      console.log(result);
      response.send(result);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000");
});
