// deck.js
const { SUITS, RANKS } = require("../constants");

class Deck {
  constructor(numberOfDecks = 1) {
    this.numberOfDecks = numberOfDecks;
    this.deck = [];
    this.init();
  }

  init() {
    // Generate all cards for the specified number of decks
    for (let d = 0; d < this.numberOfDecks; d++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          this.deck.push(`${rank}${suit}`);
        }
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCards(num = 2) {
    // Splice off `num` cards from the end
    return this.deck.splice(-num, num);
  }
}

module.exports = Deck;
