const Session = require("./classes/session");

// Simple in-memory store (keyed by sessionId)
const sessionInstances = {};

module.exports = {
  // Create a new session and store it in memory
  startSession: () => {
    const sessionObject = new Session();
    sessionInstances[sessionObject.sessionId] = sessionObject;
    return sessionObject.getSessionState();
  },

  // Start a new hand within a given session
  newHand: ({ sessionId, bet }) => {
    const sessionObject = sessionInstances[sessionId];
    if (!sessionObject) {
      throw new Error("Session not found");
    }
    let newHand = sessionObject.startNewHand(parseFloat(bet));

    // verify the hand is not over (eg. player or dealer dealt blackjack)
    const playerTotal = newHand.playerHand.reduce(
      (acc, cur) => acc + cur.value,
      0
    );
    const dealerTotal = newHand.dealerHand.reduce(
      (acc, cur) => acc + cur.value,
      0
    );

    if (playerTotal === 21 || dealerTotal === 21) {
      sessionObject.settleHand(newHand);
    }
    let hand = newHand.getHandState();
    const session = sessionObject.getSessionState();

    return { hand, session };
  },

  // Helper function to locate a hand by its handId across sessions
  findHandById: (handId) => {
    for (const sessionObject of Object.values(sessionInstances)) {
      const hand = sessionObject.hands.find((h) => h.handId === handId);
      if (hand) {
        return { hand, session: sessionObject };
      }
    }
    return null;
  },

  // Process a player action on a hand by invoking its own methods
  playerAction: ({ handId, action }) => {
    const result = module.exports.findHandById(handId);
    if (!result) throw new Error("Hand not found");

    const { hand: currentHand, session: sessionObject } = result;

    // Let the hand do its action (which may move phase to 'completed')
    switch (action) {
      case "hit":
        currentHand.hit();
        break;
      case "stand":
        currentHand.stand();
        break;
      case "double":
        currentHand.double();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // If the hand is now completed, settle it in the session
    // Then re-grab the final state after settlement:
    let hand;
    if (currentHand.phase === "completed") {
      sessionObject.settleHand(currentHand);
      hand = currentHand.getHandState();
    } else {
      hand = currentHand.getHandState();
    }

    const session = sessionObject.getSessionState();
    return {
      hand,
      session,
    };
  },

  // End a session by sessionId and return session state and stats
  endSession: ({ sessionId }) => {
    const sessionObject = sessionInstances[sessionId];
    if (!sessionObject) {
      throw new Error("Session not found");
    }
    return sessionObject.endSession();
  },

  // Retrieve a hand's state by its handId
  getHand: ({ handId }) => {
    const result = module.exports.findHandById(handId);
    if (!result) {
      throw new Error("Hand not found");
    }
    const { hand } = result;
    return hand.getHandState();
  },

  getHandHistory: ({ sessionId }) => {
    const sessionObject = sessionInstances[sessionId];
    if (!sessionObject) {
      throw new Error("Session not found");
    }
    return sessionObject.getHandHistory();
  },
};
