import React from "react";
import { GiClubs, GiSpades, GiDiamonds, GiHearts } from "react-icons/gi";

function Card({ rank, suit, value, hidden = false }) {
  if (hidden) {
    return <div class="card-facedown"></div>;
  }

  let suitImg;

  switch (suit) {
    case "clubs":
      suitImg = <GiClubs />;
      break;
    case "spades":
      suitImg = <GiSpades />;
      break;
    case "diamonds":
      suitImg = <GiDiamonds />;
      break;
    case "hearts":
      suitImg = <GiHearts />;
      break;
    default:
      "N/A";
      break;
  }

  return (
    <div class="card">
      <span class="top-rank">{rank}</span>
      <span class="suit">{suitImg}</span>
      <span class="bottom-rank">{rank}</span>
    </div>
  );
}

export default Card;
