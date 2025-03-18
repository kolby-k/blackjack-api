const Deck = require("./deck");
const Hand = require("./hand");
const { DEFAULT_RULES, INITIAL_BANKROLL } = require("../constants");

class Session {
  constructor() {
    this.sessionId = "S-" + Date.now(); // Consider using a UUID for production
    this.createdAt = new Date().toISOString();
    this.endedAt = null;
    this.deck = new Deck(DEFAULT_RULES.decks);
    this.hands = []; // Array to store all hands played in this session
    this.playerBankroll = INITIAL_BANKROLL;
    this.rules = { ...DEFAULT_RULES };
  }

  // Start a new hand within the session
  startNewHand(bet) {
    // You can add validations here for bet limits, bankroll, etc.
    const hand = new Hand(this.deck, bet, this.rules);
    this.hands.push(hand);
    return hand;
  }

  settleHand(hand) {
    const { outcome, net } = hand.computeOutcomeAndPayout();
    hand.outcome = outcome;
    hand.netGain = net;
    this.playerBankroll += net;
    hand.phase = "completed";
  }

  // Return the current state of the session
  getSessionState() {
    return {
      session: {
        sessionId: this.sessionId,
        createdAt: this.createdAt,
        endedAt: this.endedAt,
        playerBankroll: this.playerBankroll,
        rules: this.rules,
      },
      // Each Hand instance must implement getHandState
      hands: this.hands.map((hand) => hand.getHandState()),
    };
  }

  // Optionally, add a method to aggregate session stats
  getSessionStats() {
    const totalWins = this.hands.filter((h) => h.outcome === "win").length;
    const totalLosses = this.hands.filter((h) => h.outcome === "lose").length;
    const totalPushes = this.hands.filter((h) => h.outcome === "push").length;
    const netProfit = this.hands.reduce((sum, h) => sum + h.netGain, 0);

    return { totalWins, totalLosses, totalPushes, netProfit };
  }
  // End the session and return the final session state and stats
  endSession() {
    this.endedAt = new Date().toISOString();
    const session = this.getSessionState();
    const stats = this.getSessionStats();
    return { session, stats };
  }
}

module.exports = Session;
