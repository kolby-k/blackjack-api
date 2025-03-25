import React from "react";
import Card from "./Card";

function Hand({ isPlayer, cards = [], total }) {
  if (!cards || cards.length === 0) return;
  return (
    <div className="flex h-[50%]  items-center justify-center">
      <h2 className="text-slate-200 font-semibold text-2xl text-center p-2">
        {isPlayer ? "Your Hand" : "Dealer's Hand"}: {total}
        <span className="flex flex-row">
          {cards.map((card, idx) => {
            if (card === "Hidden") return <Card key={`hidden-${idx}`} hidden />;
            return (
              <Card
                key={`${card.rank}-${card.suite}-${idx}`}
                rank={card.rank}
                suit={card.suit}
                value={card.value}
                index={idx}
              />
            );
          })}
        </span>
      </h2>
    </div>
  );
}

export default Hand;
