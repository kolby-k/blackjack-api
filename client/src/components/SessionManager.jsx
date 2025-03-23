import React, { useState } from "react";
import Button from "./Button";
import api from "../services/api";
import Loader from "./Loader";

function SessionManager({ session, updateSession, endSession, netChange }) {
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
    <div
      id="session-manager"
      className={sessionInProgress ? "justify-end" : "justify-center"}
    >
      <div className="flex flex-col justify-center h-[100%]">
        {!sessionInProgress && (
          <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
            Ready to Play Blackjack?
          </h1>
        )}
        {sessionInProgress ? (
          <span className="flex flex-col items-center justify-center">
            <h2 className="text-slate-300 text-xl font-medium mx-auto">
              Current Balance: ${session.playerBankroll}{" "}
              {(netChange > 0 || netChange < 0) && (
                <span
                  className={`text-base font-light ${
                    netChange > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {`(${netChange > 0 ? "+" : ""}${netChange})`}
                </span>
              )}
            </h2>

            <p className="text-slate-200 font-normal text-lg text-center pb-2">
              Started: {new Date(session.createdAt).toLocaleTimeString()}
            </p>
          </span>
        ) : (
          <div className="flex flex-col flex-1 gap-4 mt-2 justify-evenly items-center text-slate-200">
            <h2 className="text-lg">You will start with a $500 bankroll</h2>
            <h3 className="text-md font-semibold">Good Luck!</h3>
            <Button
              title="Start Playing!"
              onClick={startSession}
              style={
                "bg-blue-600 border-2 cursor-pointer hover:bg-blue-500 border-blue-200 m-4 p-4"
              }
              disabled={sessionInProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionManager;
