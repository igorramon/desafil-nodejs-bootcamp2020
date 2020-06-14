const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists(req, res, next) {
  const { id } = req.params;

  const repository = repositories.find(p => p.id == id);

  if (!repository) {
    return res.status(400).json({ massage: "the repository does not exist" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const repository = repositories.find(r => id === r.id);

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(r => r.id == id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(r => id === r.id);
  repository.likes = ++repository.likes;

  return response.json(repository);
});

module.exports = app;
