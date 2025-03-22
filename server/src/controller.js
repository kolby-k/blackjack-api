const services = require("./services");

module.exports = {
  // Create a new blackjack session
  startNewSession: (req, res, next) => {
    try {
      const sessionObject = services.startSession();
      res.status(201).json(sessionObject);
    } catch (e) {
      next(e);
    }
  },

  // Start a new hand within an existing session
  startNewHand: (req, res, next) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) throw new Error("Session ID is required");
      // Optionally, pass a bet or other data from req.body if needed:
      const { hand, session } = services.newHand({
        sessionId,
        bet: req.body.bet,
      });
      res.status(201).json({ hand, session });
    } catch (e) {
      next(e);
    }
  },

  // Process player actions (e.g., hit, stand, double) on a specific hand.
  // The optional "amount" parameter can be used for bets or similar actions.
  playerAction: (req, res, next) => {
    try {
      const { handId, action } = req.params;
      const { hand, session } = services.playerAction({
        handId,
        action,
      });
      res.status(200).json({ hand, session });
    } catch (e) {
      next(e);
    }
  },

  // End the session and return aggregated session stats
  endSession: (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { session, stats, hands } = services.endSession({ sessionId });
      res.status(200).json({ session, stats, hands });
    } catch (e) {
      next(e);
    }
  },

  // Retrieve the state of an existing hand by its handId
  getHandState: (req, res, next) => {
    try {
      const { handId } = req.params;
      const hand = services.getHand({ handId });
      res.status(200).json({ hand });
    } catch (e) {
      next(e);
    }
  },

  getSessionHands: (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const hands = services.getHandHistory({ sessionId });
      res.status(200).json(hands);
    } catch (e) {
      next(e);
    }
  },
};
