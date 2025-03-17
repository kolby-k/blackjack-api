import React, { useState } from "react";
import Button from "../components/Button";
import api from "../services/api";
import Loader from "../components/Loader";

function BlackjackScreen() {
  const [session, setSession] = useState(null);
  const [hand, setHand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bet, setBet] = useState(10);

  const handleStartGame = async () => {
    setLoading(true);
    const { session } = await api.startNewSession();
    if (!session) {
      setError("Error in api, startNewSession");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSession(session);
  };

  const dealHand = async () => {
    setLoading(true);
    const { sessionId } = session;

    const { hand } = await api.dealNewHand({ sessionId, bet });
    if (!hand) {
      setError("Error in api, dealNewHand");
      setLoading(false);
      return;
    }

    setLoading(false);
    setHand(() => ({ ...hand }));
  };

  const handlePlayerAction = async (action) => {
    setLoading(true);
    const { handId } = hand;

    const data = await api.playerAction({ handId, action });
    if (!data.hand) {
      setError("Error in api, playerAction");
      setLoading(false);
      return;
    }

    if (data.session) {
      setSession(() => ({ ...session }));
    }

    setLoading(false);
    setHand(() => ({ ...data.hand }));
  };

  return (
    <div id="screen">
      {loading && <Loader />}
      {!session && (
        <div>
          {!error ? (
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                Play Blackjack?
              </h1>
              <Button
                title="Start Playing!"
                onClick={handleStartGame}
                style={"bg-blue-500 border-2 border-blue-200 p-4"}
              />
            </div>
          ) : (
            <div>
              <p id="error">{error}</p>
            </div>
          )}
        </div>
      )}
      {session && (
        <div className="flex flex-col flex-1 gap-4 justify-evenly">
          <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
            Game State:
          </h1>
          <pre className="text-slate-300 m-4 max-w-1/3 mx-auto">
            {JSON.stringify(session, null, 3)}
          </pre>

          <label
            for="bet"
            title="Bet"
            className="text-center text-slate-200 -mb-3 text-lg font-medium"
          >
            Bet Amount:
          </label>
          <input
            name="bet"
            type="slider"
            min={10}
            max={100}
            value={parseInt(bet) || ""}
            onChange={(e) => setBet(e.target.value.toString())}
            className="text-slate-200 bg-slate-700 border-slate-500 border-2 w-1/4 p-1 text-lg mx-auto"
          />
          <Button
            title="Deal Hand"
            onClick={dealHand}
            style={
              "bg-blue-500 border-2 border-blue-200 p-4 w-1/3 mx-auto mt-4"
            }
          />
          {hand && (
            <div>
              <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                Current Hand:
              </h1>
              <pre className="text-slate-300 m-4 max-w-1/3 mx-auto">
                {JSON.stringify(hand, null, 3)}
              </pre>
              {hand?.phase !== "completed" ? (
                <>
                  <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                    Actions
                  </h1>
                  <div className="flex flex-row justify-evenly w-1/2 mx-auto">
                    <Button
                      title="Stand"
                      onClick={() => handlePlayerAction("stand")}
                      style={
                        "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
                      }
                    />
                    <Button
                      title="Hit"
                      onClick={() => handlePlayerAction("hit")}
                      style={
                        "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
                      }
                    />
                    <Button
                      title="Double"
                      onClick={() => handlePlayerAction("double")}
                      style={
                        "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
                      }
                    />
                  </div>
                </>
              ) : (
                <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                  You {hand.outcome}!
                </h1>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlackjackScreen;
