const Session = require("./classes/session");

// Simple in-memory store (keyed by sessionId)
const sessionInstances = {};

module.exports = {
  // Create a new session and store it in memory
  startSession: () => {
    const session = new Session();
    sessionInstances[session.sessionId] = session;
    return session.getSessionState();
  },

  // Start a new hand within a given session
  newHand: ({ sessionId, bet }) => {
    const session = sessionInstances[sessionId];
    if (!session) {
      throw new Error("Session not found");
    }
    const hand = session.startNewHand(bet);
    return hand.getHandState();
  },

  // Helper function to locate a hand by its handId across sessions
  findHandById: (handId) => {
    for (const session of Object.values(sessionInstances)) {
      const hand = session.hands.find((h) => h.handId === handId);
      if (hand) {
        return { hand, session };
      }
    }
    return null;
  },

  // Process a player action on a hand by invoking its own methods
  playerAction: ({ handId, action, amount }) => {
    const result = module.exports.findHandById(handId);
    if (!result) throw new Error("Hand not found");

    const { hand, session } = result;

    // Let the hand do its action (which may move phase to 'completed')
    let updatedHandState;
    switch (action) {
      case "hit":
        updatedHandState = hand.hit();
        break;
      case "stand":
        updatedHandState = hand.stand();
        break;
      case "double":
        updatedHandState = hand.double();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // If the hand is now completed, settle it in the session
    // Then re-grab the final state after settlement:
    if (hand.phase === "completed") {
      session.settleHand(hand);
      updatedHandState = hand.getHandState();
    }

    const currentSessionState = session.getSessionState();
    return {
      updatedHand: updatedHandState,
      currentSession: currentSessionState,
    };
  },

  // End a session by sessionId and return session state and stats
  endSession: ({ sessionId }) => {
    const session = sessionInstances[sessionId];
    if (!session) {
      throw new Error("Session not found");
    }
    return session.endSession();
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
};
