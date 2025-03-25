import React, { useState } from "react";
import api from "../services/api";
import Loader from "./Loader";
import Button from "./Button";
import Hand from "./Hand";
import HandActions from "./HandActions";
import HandStats from "./HandStats";
import Betting from "./Betting";

function Table({
  sessionId,
  hand,
  setHand,
  playerBankroll,
  updateBankroll,
  updateHistory,
  bet,
  updateBet,
  endSession,
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
      }

      updateBankroll(session.playerBankroll - bet);
      setHand({ ...hand });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const handInProgress =
    hand && (hand?.phase === "player_turn" || hand?.phase === "dealer_turn");

  return (
    <div id="table">
      <div id="card-container">
        <Hand
          cards={hand?.dealer?.hand}
          total={hand?.dealer?.visibleTotal}
          isPlayer={false}
        />
        <Hand
          cards={hand?.player?.hand}
          total={hand?.player?.total}
          isPlayer={true}
        />
        <HandActions
          allowedActions={hand?.player?.allowedActions}
          handlePlayerAction={handlePlayerAction}
          handInProgress={handInProgress}
        />
        <HandStats hand={hand} />
      </div>
      <Betting
        bet={bet}
        updateBet={updateBet}
        playerBankroll={playerBankroll || 0}
        handInProgress={handInProgress}
        dealHand={dealHand}
        loading={loading}
        endSession={endSession}
      />
    </div>
  );
}

export default Table;
