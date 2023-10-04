

//SECOND TRY

// const http = require('http')

const express = require("express");

const app = express();

const cors = require('cors')

app.use(cors())

app.use(express.json());

const morgan = require("morgan");

app.use(express.static("dist"))

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons",  (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
