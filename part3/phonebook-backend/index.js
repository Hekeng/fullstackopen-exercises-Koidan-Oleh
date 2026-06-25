require("dotenv").config();
const express = require("express"); //add biblioteck
const Person = require("./models/person");
const morgan = require("morgan"); //service shows app logs
const app = express(); //create server

// const cors = require("cors");

// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
// 	console.log("phonebook:");

// 	result.forEach((person) => {
// 	  console.log(person.name, person.number);
// 	});
// 	mongoose.connection.close();
//   });
// } else if (process.argv.length === 5) {
//   const person = new Person({
// 	name: process.argv[3],
// 	number: process.argv[4],
//   });

//   person.save().then((result) => {
// 	console.log(`added ${person.name} number ${person.number} to phonebook`);
// 	mongoose.connection.close();
//   });
// } else {
//   mongoose.connection.close();
// }

app.use(express.static("dist"));

// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Твой сервер будет отвечать ТОЛЬКО твоему фронтенду
//   }),
// );

app.use(express.json()); //json translate

morgan.token("body", (request, response) => {
  if (request.method != "POST") {
    return "";
  }

  return JSON.stringify(request.body);
});

app.use(morgan(":method :url :status :response-time :body"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
  console.log("=== НОВЫЙ ЗАПРОС ===");
  console.log("Метод:", request.method);
  console.log("Адрес (URL):", request.url);
  console.log("Что у него внутри (Body):", request.body);
  console.log("====================");

  //   const util = require("util");
  //   console.log(util.inspect(request, { depth: 0, colors: true }));

  console.log("====================");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
  //   response.json(persons);
});

app.get("/info", (request, response) => {
  let date = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateId = () => {
  const maxId = getRandomNumber(0, 10000);
  return String(maxId);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (
    persons.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase(),
    )
  ) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
