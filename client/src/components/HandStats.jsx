import React from "react";
import Button from "./Button";

function HandStats({ hand = {} }) {
  if (!hand?.outcome) return;

  let label;
  switch (hand.outcome) {
    case "win":
      label = "You Win!";
      break;
    case "lose":
      label = "You Lose!";
      break;
    case "push":
      label = "Push!";
      break;
    default:
      break;
  }
  return (
    <div className="flex flex-col items-center justify-center border-b-2 mb-8 w-1/2 mx-auto">
      <h1 className="text-slate-200 font-semibold text-4xl text-center py-4">
        {label}
      </h1>
    </div>
  );
}

export default HandStats;
