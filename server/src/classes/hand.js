// hand.js

class Hand {
  constructor(deck, bet, rules) {
    this.handId = "H-" + Date.now(); // Consider using a UUID for production
    this.bet = bet;
    this.rules = rules;
    this.phase = "player_turn"; // Indicates the player's turn is active
    this.playerHand = [];
    this.dealerHand = [];
    this.deck = deck; // Reference to the session's deck
    this.lastAction = null; // Tracks the last action taken
    this.outcome = null; // "win", "lose", or "push"
    this.netGain = 0;

    this.startHand();
  }

  startHand() {
    // Deal initial cards for both player and dealer
    this.playerHand = this.deck.dealCards(2);
    this.dealerHand = this.deck.dealCards(2);
    // Optionally, check here for natural blackjack conditions.
  }

  computeOutcomeAndPayout() {
    const playerTotal = this.getHandTotal(this.playerHand);
    const dealerTotal = this.getHandTotal(this.dealerHand);
    const playerHas2CardBlackjack =
      this.playerHand.length === 2 && playerTotal === 21;
    const dealerHas2CardBlackjack =
      this.dealerHand.length === 2 && dealerTotal === 21;

    if (playerHas2CardBlackjack && dealerHas2CardBlackjack) {
      return { outcome: "push", net: 0 };
    } else if (playerHas2CardBlackjack) {
      return { outcome: "win", net: this.bet * 1.5 };
    } else if (dealerHas2CardBlackjack) {
      return { outcome: "lose", net: -this.bet };
    } else if (dealerTotal > 21) {
      return { outcome: "win", net: this.bet };
    } else if (playerTotal > dealerTotal) {
      return { outcome: "win", net: this.bet };
    } else if (playerTotal < dealerTotal) {
      return { outcome: "lose", net: -this.bet };
    } else {
      return { outcome: "push", net: 0 };
    }
  }

  // Compute the total value of a given hand (array of cards)
  getHandTotal(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      const rank = card.slice(0, -1); // Remove the suit
      if (["J", "Q", "K"].includes(rank)) {
        total += 10;
      } else if (rank === "A") {
        total += 11;
        aces++;
      } else {
        total += parseInt(rank, 10);
      }
    }

    // Adjust for Aces if total exceeds 21
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  }

  // Determine allowed actions based on the player's current hand state
  getAllowedActions() {
    if (this.phase !== "player_turn") {
      return [];
    }

    const total = this.getHandTotal(this.playerHand);
    // If the player is bust or has 21, no further actions are allowed
    if (total >= 21) return [];
    const actions = ["hit", "stand"];
    // Allow doubling on totals of 9, 10, or 11 (or adjust as per your rules)
    if ([9, 10, 11].includes(total)) {
      actions.push("double");
    }
    // Further actions (like split) can be added based on hand composition
    return actions;
  }

  // Return the current state of this hand
  getHandState() {
    const playerTotal = this.getHandTotal(this.playerHand);
    const dealerTotal = this.getHandTotal(this.dealerHand);

    let dealerCardsToShow = this.dealerHand;
    if (this.phase === "player_turn") {
      dealerCardsToShow = [this.dealerHand[0], "Hidden"];
    }

    return {
      handId: this.handId,
      phase: this.phase,
      bet: this.bet,
      lastAction: this.lastAction,

      // Include these lines:
      outcome: this.outcome,
      netGain: this.netGain,

      // The rest remains
      player: {
        hand: this.playerHand,
        total: playerTotal,
        allowedActions: this.getAllowedActions(),
      },
      dealer: {
        hand: dealerCardsToShow,
        total: dealerTotal,
        visibleCard: this.dealerHand[0],
      },
    };
  }

  // hand.js
  runDealerPlay() {
    // If dealer is already past "dealer_turn" phase, we won't do anything.
    // This is just a safeguard, so we only run dealer logic once.
    if (this.phase !== "dealer_turn") {
      return;
    }

    // Example: dealer hits until total >= 17 or (hits soft 17 if your rule says so)
    // (Expand if you have special rules like dealerHitsSoft17).
    while (this.getHandTotal(this.dealerHand) < 17) {
      this.dealerHand.push(this.deck.dealCards(1)[0]);
    }

    // Once dealer is finished, mark the hand completed
    this.phase = "completed";
  }

  hit() {
    if (this.phase !== "player_turn") {
      throw new Error("Cannot hit at this time");
    }
    const card = this.deck.dealCards(1)[0];
    this.playerHand.push(card);
    this.lastAction = "hit";

    const playerTotal = this.getHandTotal(this.playerHand);

    if (playerTotal > 21) {
      // Player busts; dealer does NOT need to draw further in standard blackjack
      this.phase = "completed";
    } else if (playerTotal === 21) {
      // If you want to auto-stand on 21, do:
      this.phase = "dealer_turn";
      this.runDealerPlay();
    }
    // Otherwise, the phase remains "player_turn" and the player can choose more actions.

    return this.getHandState();
  }

  stand() {
    if (this.phase !== "player_turn") {
      throw new Error("Cannot stand at this time");
    }
    this.lastAction = "stand";

    // Move to dealer turn, then run dealer logic in one shot
    this.phase = "dealer_turn";
    this.runDealerPlay();

    return this.getHandState();
  }

  double() {
    if (this.phase !== "player_turn") {
      throw new Error("Cannot double at this time");
    }
    this.bet *= 2;
    this.lastAction = "double";

    // Deal one card to player...
    const card = this.deck.dealCards(1)[0];
    this.playerHand.push(card);

    // Then automatically go to dealer's turn
    this.phase = "dealer_turn";
    this.runDealerPlay();

    return this.getHandState();
  }

  // Future methods: implement split, insurance, etc., as needed.
}

module.exports = Hand;
