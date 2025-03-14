// game.js
const Deck = require("./deck");
const { MIN_BET, MAX_BET, DEFAULT_RULES } = require("./constants");

class Game {
  constructor() {
    this.gameId = "B-" + Date.now(); // or use a UUID library
    this.createdAt = new Date().toISOString();
    this.phase = "round_started"; // e.g. can be "waiting_for_bet", "in_progress", etc.

    // Store rules
    this.rules = { ...DEFAULT_RULES };

    this.deck = new Deck(this.rules.decks); // e.g. 1 or 6 decks
    this.minBet = MIN_BET;
    this.maxBet = MAX_BET;

    // store bankroll (or leave it outside this class)
    this.playerBankroll = 1000;
    this.playerBet = null;

    // Game flow
    this.currentTurn = "player";
    this.playerCurrentAction = null;
    this.playerLastAction = "new_game";

    // Hands
    this.playerHand = [];
    this.dealerHand = [];

    // Start the game immediately
    this.startGame();
  }

  startGame() {
    // Shuffle the existing deck, do not recreate it
    this.deck.shuffle();

    // Deal initial hands
    this.playerHand = this.deck.dealCards(2);
    this.dealerHand = this.deck.dealCards(2);

    console.log("Player Hand:", this.playerHand);
    console.log("Dealer Hand:", this.dealerHand);

    // Return the initial state
    return this.getGameState();
  }

  /**
   * Compute a hand's total.
   * Handles Aces (can be 1 or 11).
   */
  getHandTotal(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      const rank = card.slice(0, -1); // everything but last char (2..A)
      if (["J", "Q", "K"].includes(rank)) {
        total += 10;
      } else if (rank === "A") {
        total += 11;
        aces += 1;
      } else {
        total += parseInt(rank, 10);
      }
    }

    // Adjust for Aces if total is too high
    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  /**
   * Basic function to figure out which actions are allowed right now.
   * TODO: expand this logic as needed (splits, doubles, insurance, etc.).
   */
  getAllowedActions() {
    const playerTotal = this.getHandTotal(this.playerHand);

    // If bust or 21, no further actions
    if (playerTotal >= 21) {
      return [];
    }

    // Minimal example: player can always "hit" or "stand".
    const actions = ["hit", "stand"];

    // If total is 9, 10, or 11, maybe "double" is valid
    if ([9, 10, 11].includes(playerTotal)) {
      actions.push("double");
    }

    return actions;
  }

  /**
   * Main method to get the entire game state object.
   */
  getGameState() {
    //    const dealerVisibleCard = [ this.dealerHand[0], "XX" ];

    const playerTotal = this.getHandTotal(this.playerHand);
    const dealerTotal = this.getHandTotal(this.dealerHand);

    return {
      gameId: this.gameId,
      created_at: this.createdAt,
      phase: this.phase,
      state: {
        current_turn: this.currentTurn,
        min_bet: this.minBet,
        max_bet: this.maxBet,
        rules: this.rules,
        history: [
          {
            last_player_action: this.playerLastAction,
          },
        ],
      },
      player: {
        bankroll: this.playerBankroll,
        bet: this.playerBet,
        hand: this.playerHand,
        total: playerTotal,
        allowed_actions: this.getAllowedActions(),
      },
      dealer: {
        hand: this.dealerHand,
        total: dealerTotal,
        visible_card: this.dealerHand[0],
      },
    };
  }
}

module.exports = Game;
