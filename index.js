const express = require("express");
const app = express();

const morgan = require('morgan')


app.use(express.json());

const cors = require('cors')

app.use(cors())


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('req-body', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :req-body')
)



app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const englishDate = date.toLocaleDateString("en-US");

  const htmlResponse = `<p>phonebooke has info for ${persons.length} person <br/> Request happened at ${englishDate} </p>`;
  const jsonResponse = { date: englishDate };

  res.send(htmlResponse);
  res.json(jsonResponse);
});

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  res.json(person);
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res
      .status(400)
      .json({ error: "Please fill required fields." });
  }

  const numberExists = persons.some((person) => person.number === body.number);
  if (numberExists) {
    return res.status(409).json({ error: "Number already exists" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const newPersons = persons.filter((person) => person.id !== id);

  persons = newPersons;

  res.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});