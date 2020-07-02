const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;
  const repository = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0,
  };
  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id == id;
  });

  if (repositoryIndex >= 0) {
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes,
    };
    repositories[repositoryIndex] = repository;
    return response.json(repository);
  } else {
    return response.status(400).json({ message: "Repository Not Found" });
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id == id;
  });

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  } else {
    return response.status(400).json({ message: "Repository Not Found" });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id == id;
  });

  if (repositoryIndex >= 0) {
    repositories[repositoryIndex].likes++;
    return response.json(repositories[repositoryIndex]);
  } else {
    return response.status(400).json({ message: "Repository Not Found" });
  }
});

module.exports = app;
