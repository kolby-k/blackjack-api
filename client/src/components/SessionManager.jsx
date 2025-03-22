import React, { useState } from "react";
import Button from "./Button";
import api from "../services/api";
import Loader from "./Loader";

function SessionManager({
  session,
  updateSession,
  endSession,
  updateBankroll,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState(null);

  const startSession = async () => {
    try {
      setLoading(true);
      const session = await api.startNewSession();

      if (!session) {
        throw new Error("Error in api, startNewSession");
      }

      let { rules, ...sessionData } = session;
      updateSession(sessionData);
      setRules(rules);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const sessionId = session?.sessionId;
  const sessionInProgress = !!sessionId;

  if (loading) return <Loader />;
  return (
    <div id="session-manager">
      <div className="flex flex-col justify-center h-[100%]">
        <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
          {sessionInProgress ? "Good Luck!" : "Play Blackjack!"}
        </h1>
        {sessionInProgress ? (
          <span className="flex flex-col items-center justify-center">
            <h2 className="text-slate-300 text-xl mx-auto">
              Current Balance: ${session.playerBankroll}
            </h2>

            <p className="text-slate-200 font-normal text-lg text-center pb-2">
              Started: {new Date(session.createdAt).toLocaleTimeString()}
            </p>
          </span>
        ) : (
          <div className="flex flex-col flex-1 justify-evenly items-center text-slate-200">
            <span className="flex flex-row text-xl">
              <label htmlFor="bankroll" className="mr-4 mx-auto">
                Starting Bankroll $
              </label>
              <input
                name="bankroll"
                type="number"
                placeholder="Enter starting bankroll"
                value={session?.playerBankroll || 0}
                onChange={(e) => updateBankroll(Number(e.target.value))}
                disabled={sessionInProgress}
                className="bg-slate-700 border-slate-500 border-2 px-1"
              />
            </span>
            <Button
              title="Start Playing!"
              onClick={startSession}
              style={"bg-blue-500 border-2 w-1/3 border-blue-200 p-4"}
              disabled={sessionInProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionManager;
