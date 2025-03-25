import React, { useState } from "react";
import Button from "./Button";

function HandHistroy({ handHistory }) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col mt-10">
      {/* Button to toggle Hand History */}
      {handHistory.length > 0 && (
        <Button
          title={
            showHistory
              ? "Hide Hand History - JSON"
              : "Show Hand History - JSON"
          }
          onClick={() => setShowHistory(!showHistory)}
          style={
            "bg-blue-900 border-2 border-blue-200 hover:bg-blue-800 font-semibold text-slate-200 p-4 w-1/3 mx-auto my-8"
          }
        />
      )}
      {/* Conditionally show the hand history */}
      {showHistory && (
        <>
          <h1 className="text-slate-200 font-semibold text-2xl text-center pt-2">
            Hand History
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
