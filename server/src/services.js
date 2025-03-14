const Game = require("./game");

// Simple in-memory store (keyed by gameId)
const gameInstances = {};

module.exports = {
  startGame: () => {
    const game = new Game();
    // Store this instance in our "dictionary"
    gameInstances[game.gameId] = game;

    // Return the new game’s state
    return game.getGameState();
  },

  getGame: ({ id }) => {
    const game = gameInstances[id];
    if (!game) {
      throw new Error("Game not found");
    }
    return game.getGameState();
  },

  // an action ("hit", "stand", etc.)
  // TODO: Expand logic as needed for each action
  playerAction: (id, action) => {
    const game = gameInstances[id];
    if (!game) {
      throw new Error("Game not found");
    }

    switch (action) {
      case "hit":
        // deal one more card to the player's hand
        const card = game.deck.dealCards(1)[0];
        game.playerHand.push(card);
        game.playerLastAction = "hit";
        break;

      case "stand":
        // Switch turn, etc.
        game.playerLastAction = "stand";
        // Possibly trigger dealer’s turn
        break;

      case "double":
        // Double logic: double bet, deal exactly one more card, then stand
        // ...
        game.playerLastAction = "double";
        break;

      // Add other actions like "split", "insurance", etc.

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Return updated state
    return game.getGameState();
  },
};
