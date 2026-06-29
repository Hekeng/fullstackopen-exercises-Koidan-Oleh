require("dotenv").config();
const express = require("express"); //add biblioteck
const Person = require("./models/person");
const morgan = require("morgan"); //service shows app logs
const app = express(); //create server

app.use(express.static("dist"));

app.use(express.json()); //json translate

morgan.token("body", (request, response) => {
  if (request.method != "POST") {
    return "";
  }

  return JSON.stringify(request.body);
});

app.use(morgan(":method :url :status :response-time :body"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
  console.log("=== НОВЫЙ ЗАПРОС ===");
  console.log("Метод:", request.method);
  console.log("Адрес (URL):", request.url);
  console.log("Что у него внутри (Body):", request.body);
  console.log("====================");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response, next) => {
  let date = new Date().toString();

  Person.countDocuments()
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p> <p>${date}</p>`,
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, respons, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      respons.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
