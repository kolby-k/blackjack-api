import React, { useState } from "react";
import Button from "./Button";

function HandHistroy({ handHistory }) {
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      {/* Button to toggle Hand History */}
      {handHistory.length > 0 && (
        <Button
          title={showHistory ? "Hide Hand History" : "Show Hand History"}
          onClick={(prev) => setShowHistory(!prev)}
          style={"bg-blue-500 border-2 border-blue-200 p-4 w-1/3 mx-auto mt-4"}
        />
      )}
      {/* Conditionally show the hand history */}
      {showHistory && (
        <>
          <h1 className="text-slate-200 font-semibold text-2xl text-center pt-2">
            Hand History {sessionId}
          </h1>

          <pre className="text-slate-300 m-4 max-w-1/3 mx-auto">
            {JSON.stringify(handHistory, null, 3)}
          </pre>
        </>
      )}
    </div>
  );
}

export default HandHistroy;
