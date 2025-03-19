class Deck {
  constructor(numDecks = 1) {
    this.numDecks = numDecks;
    this.cards = [];
    this.totalCards = 0;
    this.cardsDealt = 0;
    this.createDeck();
    this.shuffle();
  }

  createDeck() {
    this.cards = [];
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    for (let d = 0; d < this.numDecks; d++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          this.cards.push({
            suit,
            rank,
            value: this.getValue(rank),
          });
        }
      }
    }
  }

  getValue(rank) {
    if (rank === "A") {
      return 11;
    } else if (["J", "Q", "K"].includes(rank)) {
      return 10;
    } else {
      return parseInt(rank);
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(numToDeal = 1) {
    if (this.getPenetration() >= 0.75 || numToDeal >= this.size()) {
      this.createDeck();
      this.shuffle();
    }
    if (numToDeal > 1) {
      this.cardsDealt += numToDeal;
      return this.cards.splice(-numToDeal, numToDeal);
    }
    this.cardsDealt++;
    // Always return an array, even for a single card
    return [this.cards.pop()];
  }

  isEmpty() {
    return this.cards.length === 0;
  }

  size() {
    return this.cards.length;
  }

  getPenetration() {
    return this.cardsDealt / this.size();
  }
}

module.exports = Deck;
