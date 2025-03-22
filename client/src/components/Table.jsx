import React, { useState } from "react";
import api from "../services/api";
import Loader from "./Loader";
import Button from "./Button";
import Card from "./Card";

function Table({
  sessionId,
  hand,
  setHand,
  startingBankroll,
  updateBankroll,
  updateHistory,
  bet,
  updateBet,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlayerAction = async (action) => {
    try {
      setLoading(true);
      const { handId } = hand;
      const data = await api.playerAction({ handId, action });

      if (!data.hand || !data.session) {
        throw new Error("Error in api.playerAction");
      }

      const { session, hand: updatedHand } = data;

      if (updatedHand.phase === "completed") {
        updateHistory(updatedHand);
        updateBankroll(session.playerBankroll);
      }

      setHand({ ...updatedHand });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const dealHand = async () => {
    try {
      setLoading(true);
      const { hand, session } = await api.dealNewHand({
        sessionId,
        bet,
      });
      if (!hand) {
        setError("Error in api, dealNewHand");
        setLoading(false);
        return;
      }

      if (hand.phase === "completed") {
        updateHistory(hand);
        updateBankroll(session.playerBankroll);
      }

      setHand({ ...hand });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const handNotStarted = !hand;
  const handInProgress =
    hand && (hand?.phase === "player_turn" || hand?.phase === "dealer_turn");
  const handIsComplete = hand?.phase === "completed";
  const turn =
    hand && hand?.phase === "player_turn" ? "Your Turn" : "Dealer Turn";

  const bettingAllowed = !hand || handIsComplete;
  console.log(hand);
  console.log(bettingAllowed);
  return (
    <div id="table">
      {!handNotStarted && (
        <div id="card-container">
          <div className="flex h-[50%] items-center justify-center">
            <h2 className="text-slate-200 font-semibold text-2xl text-center p-2">
              Dealer's Hand: {hand.dealer?.visibleTotal}
              <span className="flex flex-row">
                {hand.dealer.hand.map((card, idx) => {
                  if (card === "Hidden") return <Card hidden />;
                  return (
                    <Card
                      key={`${card.rank}-${card.suite}-${idx}`}
                      rank={card.rank}
                      suit={card.suit}
                      value={card.value}
                    />
                  );
                })}
              </span>
            </h2>
          </div>
          <div className="flex h-[50%]  items-center justify-center">
            <h2 className="text-slate-200 font-semibold text-2xl text-center p-2">
              Your Cards: {hand.player.total}
              <span className="flex flex-row">
                {hand.player.hand.map((card, idx) => {
                  return (
                    <Card
                      key={`${card.rank}-${card.suite}-${idx}`}
                      rank={card.rank}
                      suit={card.suit}
                      value={card.value}
                    />
                  );
                })}
              </span>
            </h2>
          </div>
          {!handIsComplete ? (
            <span>
              <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                Actions
              </h1>
              <div className="flex flex-row justify-evenly w-1/2 mx-auto">
                {hand.player.allowedActions.length > 0 &&
                  hand.player.allowedActions.map((action, idx) => (
                    <Button
                      key={idx}
                      title={action}
                      onClick={() => handlePlayerAction(action)}
                      style={
                        "bg-blue-500 border-2 border-blue-200 p-4 w-1/3 mx-auto mt-4"
                      }
                    />
                  ))}
              </div>
            </span>
          ) : (
            <span className="flex flex-col items-center justify-center">
              <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                You {hand.outcome}!
              </h1>
              <p className="text-slate-300">Total: ${hand.netGain}</p>
            </span>
          )}
        </div>
      )}
      {!handInProgress && (
        <div id="bet-section">
          <label
            htmlFor="bet"
            title="Bet"
            className="text-center text-slate-200 text-lg font-medium mr-4"
          >
            Bet Amount ${bet}
          </label>
          <input
            name="bet"
            type="range"
            min={10}
            max={startingBankroll}
            value={bet}
            onChange={(e) => updateBet(Number(e.target.value))}
          />
          <Button
            title="Next Hand"
            onClick={dealHand}
            disabled={loading}
            style={
              "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
            }
          />
        </div>
      )}
    </div>
  );
}

export default Table;
