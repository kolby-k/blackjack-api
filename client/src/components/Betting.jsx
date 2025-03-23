import React, { useEffect } from "react";
import Button from "./Button";

function Betting({
  bet,
  updateBet,
  dealHand,
  playerBankroll,
  handInProgress,
  loading,
  endSession,
}) {
  if (handInProgress) return;

  useEffect(() => {
    if (playerBankroll <= 10) {
      endSession();
    }
  }, [playerBankroll]);

  return (
    <>
      <div className="flex flex-1 justify-center items-center">
        <h1 className="font-semibold text-2xl text-slate-200">
          {playerBankroll > 0 ? "Make your bet!" : "Your Broke!"}
        </h1>
      </div>
      {playerBankroll > 0 && (
        <div id="bet-section">
          <label
            htmlFor="bet"
            title="Bet"
            className="text-center text-green-100 text-lg font-medium mr-4"
          >
            Bet Amount ${bet}
          </label>
          <input
            name="bet"
            type="range"
            min={10}
            max={playerBankroll >= 100 ? 100 : playerBankroll}
            value={bet}
            onChange={(e) => updateBet(Number(e.target.value))}
          />
          <p className="text-green-200 font-thin">
            Min Bet: $10 - Max Bet: $100
          </p>

          <Button
            title="Deal Me a Hand!"
            onClick={dealHand}
            disabled={loading}
            style={
              "bg-blue-700 border-2 rounded-md border-blue-200 p-4 w-[300px] mx-auto mt-4 text-blue-200 font-bold"
            }
          />
        </div>
      )}
    </>
  );
}

export default Betting;
