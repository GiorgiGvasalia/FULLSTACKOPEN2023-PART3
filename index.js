require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");
// const mongoose = require('mongoose')

app.use(cors());

app.use(express.json());

const morgan = require("morgan");

app.use(express.static("dist"));

const requestLogger = (req, res, next) => {
  console.log("Method", req.method);
  console.log("Path", req.path);
  console.log("Body", req.body);
  console.log("___");
  next();
};

morgan.token("req-body", (req, res) => JSON.stringify(req.body));

app.use(requestLogger);

const postMorganMiddleware = (req, res, next) => {
  if (req.method === "POST") {
    // Apply morgan with the custom format for POST requests
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :req-body"
    )(req, res, next);
  } else {
    next();
  }
};

app.use(postMorganMiddleware);

let persons = [
  {
    name: "hggggggggg",
    number: "9888888888",
    id: 1,
  },
  {
    name: "yu",
    number: "6677120",
    id: 2,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>SERVER</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((p) => p.toJSON()));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  // Find the person by name
  Person.findOne({ name: name })
    .then((person) => {
      if (!person) {
        // If the person with the given name doesn't exist, return a 404 response
        return res.status(404).json({ error: "Person not found." });
      }

      // Update the person's number
      person.number = number;

      // Save the updated person
      person
        .save()
        .then((updatedPerson) => {
          res.json(updatedPerson.toJSON());
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});


app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });


  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
