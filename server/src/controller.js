const services = require("./services");

module.exports = {
  startNewGame: (req, res, next) => {
    try {
      console.log("REQUEST IN STARTNEWGAME: " + req);
      const game = services.startGame();
      console.log("Game: ", game, typeof game);

      res.status(200).json({ game });
    } catch (e) {
      next(e);
    }
  },

  getGameById: (req, res, next) => {
    try {
      const { id } = req.params;

      const game = services.getGame({ id });

      res.status(201).json({ game });
    } catch (e) {
      next(e);
    }
  },
};
