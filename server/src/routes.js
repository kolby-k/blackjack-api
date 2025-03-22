const express = require("express");
const controller = require("./controller");

module.exports = () => {
  const router = express.Router();

  // Initialize a new session for heads-up blackjack
  router.post("/sessions", (req, res, next) =>
    controller.startNewSession(req, res, next)
  );

  // Start a new hand within an existing session
  router.post("/sessions/:sessionId/hands", (req, res, next) =>
    controller.startNewHand(req, res, next)
  );

  // Process player actions (hit, stand, double down, etc.) on a specific hand.
  router.post("/hands/:handId/:action", (req, res, next) =>
    controller.playerAction(req, res, next)
  );

  // End the session and receive aggregated session stats
  router.post("/sessions/:sessionId/end", (req, res, next) =>
    controller.endSession(req, res, next)
  );

  // Retrieve the state of an existing hand by hand ID
  router.get("/hands/:handId", (req, res, next) =>
    controller.getHandState(req, res, next)
  );

  router.get("/sessions/hand-history/:sessionId", (req, res, next) =>
    controller.getSessionHands(req, res, next)
  );

  return router;
};
