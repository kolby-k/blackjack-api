const express = require("express");
const controller = require("./controller");

module.exports = () => {
  const router = express.Router();

  router.get("/new-game", (req, res, next) =>
    controller.startNewGame(req, res, next)
  );

  router.post("/game/:id", (req, res, next) =>
    controller.getGameById(req, res, next)
  );

  return router;
};
