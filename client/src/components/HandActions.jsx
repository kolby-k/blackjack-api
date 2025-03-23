import React from "react";
import Button from "./Button";

function HandActions({
  allowedActions = [],
  handlePlayerAction,
  handInProgress,
}) {
  if (!handInProgress) return;
  return (
    <div id="action-container">
      <h1 className="text-slate-200 font-semibold text-2xl text-center p-2">
        Your Turn
      </h1>
      <div className="flex flex-row justify-evenly w-1/2 mx-auto">
        {allowedActions.map((action, idx) => (
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
    </div>
  );
}

export default HandActions;
