import React from "react";
import { GiClubs, GiSpades, GiDiamonds, GiHearts } from "react-icons/gi";

function Card({ rank, suit, value, hidden = false }) {
  // If the card is hidden, return a face-down card.
  if (hidden) {
    return <div id="card-facedown" />;
  }

  let SuitIcon;
  let suitColor = "black";

  switch (suit.toLowerCase()) {
    case "clubs":
      SuitIcon = <GiClubs />;
      break;
    case "spades":
      SuitIcon = <GiSpades />;
      break;
    case "diamonds":
      SuitIcon = <GiDiamonds />;
      suitColor = "red";
      break;
    case "hearts":
      SuitIcon = <GiHearts />;
      suitColor = "red";
      break;
    default:
      SuitIcon = null;
      break;
  }

  return (
    <div id="card">
      <span id="top-rank" style={{ color: suitColor }}>
        {rank}
      </span>
      <span id="suit" style={{ color: suitColor }}>
        {SuitIcon}
      </span>
      <span id="bottom-rank" style={{ color: suitColor }}>
        {rank}
      </span>
    </div>
  );
}

export default Card;
