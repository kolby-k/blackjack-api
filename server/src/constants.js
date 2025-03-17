// constants.js
module.exports = {
  SUITS: ["C", "D", "H", "S"],
  RANKS: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  MIN_BET: 10,
  MAX_BET: 100,
  INITIAL_BANKROLL: 500,
  // Example “rules” you might configure
  DEFAULT_RULES: {
    decks: 1,
    dealerHitsSoft17: true,
    blackjackPayout: "3:2",
    insuranceOffered: true,
  },
};
