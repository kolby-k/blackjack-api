import React, { useState } from "react";
import Button from "../components/Button";
import api from "../services/api";
import Loader from "../components/Loader";

function BlackjackScreen() {
  const [session, setSession] = useState(null);
  const [startingBankroll, setStartingBankroll] = useState(500);
  const [sessionId, setSessionId] = useState(null);
  const [handHistory, setHandHistory] = useState([]);
  const [rules, setRules] = useState(null);
  const [hand, setHand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [bet, setBet] = useState(10);

  const handleStartSession = async () => {
    setLoading(true);
    const { session, hands } = await api.startNewSession();
    console.log(session);
    if (!session) {
      setError("Error in api, startNewSession");
      setLoading(false);
      return;
    }
    setHandHistory(hands);
    let { sessionId, rules, playerBankroll, ...sessionData } = session;
    setSession(sessionData);
    setSessionId(sessionId);
    setRules(rules);
    setStartingBankroll(playerBankroll);
    setLoading(false);
  };

  const dealHand = async () => {
    setLoading(true);
    const { hand, session, hands } = await api.dealNewHand({ sessionId, bet });
    if (!hand) {
      setError("Error in api, dealNewHand");
      setLoading(false);
      return;
    }

    setSession({ ...session });
    setHandHistory([...hands]);
    setHand({ ...hand });
    setLoading(false);
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

    if (data?.hands) {
      setHandHistory((prev) => [...prev, ...data.hands]);
    }

    if (data?.session) {
      setSession(() => ({ ...data.session }));
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
                onClick={handleStartSession}
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
          {showHistory && (
            <>
              <h1 className="text-slate-200 font-semibold text-2xl text-center pt-2">
                Hand History {sessionId}
              </h1>
              <p className="text-slate-200 font-normal text-lg text-center pb-2">
                Started: {new Date(session.createdAt).toLocaleTimeString()}
              </p>
              <pre className="text-slate-300 m-4 max-w-1/3 mx-auto">
                {JSON.stringify(handHistory, null, 3)}
              </pre>
            </>
          )}

          <h2 className="text-slate-300 text-xl m-4 max-w-1/3 mx-auto">
            Your starting bankroll: ${startingBankroll}
          </h2>
          <h3 className="text-slate-300 text-lg m-4 max-w-1/3 mx-auto">
            New balance: ${startingBankroll - bet}
          </h3>
          <div className="flex flex-col justify-center">
            <label
              htmlFor="bet"
              title="Bet"
              className="text-center text-slate-200  text-lg font-medium"
            >
              Bet Amount: {bet}
            </label>
            <input
              name="bet"
              type="range"
              min={10}
              max={100}
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="text-slate-200 bg-slate-700 border-slate-500 border-2 w-1/4 p-1 text-lg mx-auto"
            />
          </div>
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
                Current Hand:{" "}
                {hand.phase === "player_turn" ? "Your Turn" : "Dealers Turn"}
              </h1>
              <h2 className="text-slate-200 font-semibold text-2xl text-center p-2">
                Your Cards:{" "}
                {hand.player.hand
                  .map((card) => `${card.rank} of ${card.suit}`)
                  .join(", ")}
              </h2>
              <h2 className="text-slate-200 font-semibold text-2xl text-center p-2">
                Dealers Hand:{" "}
                {hand.dealer.hand[1] === "Hidden"
                  ? `${hand.dealer.hand[0].rank} of ${hand.dealer.hand[0].suit}`
                  : hand.dealer.hand
                      .map((card) => `${card.rank} of ${card.suit}`)
                      .join(", ")}
              </h2>
              <pre className="text-slate-300 m-4 max-w-1/3 mx-auto">
                {JSON.stringify(hand, null, 3)}
              </pre>
              {hand?.phase === "player_turn" ? (
                <>
                  <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                    Actions
                  </h1>
                  <div className="flex flex-row justify-evenly w-1/2 mx-auto">
                    {hand.player.allowedActions.length > 0 &&
                      hand.player.allowedActions.map((action) => (
                        <Button
                          title={action.toString()}
                          onClick={() => handlePlayerAction(action)}
                          style={
                            "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
                          }
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
                    You {hand.outcome}!
                  </h1>
                  <span className="flex flex-col items-center justify-center">
                    <p className="text-slate-300 mx-auto">(${hand.netGain})</p>
                    <h2 className="text-slate-300 text-xl mx-auto">
                      Your New Balance: ${session.playerBankroll}
                    </h2>
                  </span>
                  <Button
                    title={"Next Hand"}
                    onClick={dealHand}
                    disabled={loading}
                    style={
                      "bg-blue-500 border-2 border-blue-200 p-4 w-[300px] mx-auto mt-4"
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlackjackScreen;
