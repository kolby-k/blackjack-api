import React, { useState } from "react";
import SessionManager from "../components/SessionManager";
import HandHistroy from "../components/HandHistroy";
import Table from "../components/Table";

function BlackjackScreen() {
  const [session, setSession] = useState(null);
  const [hand, setHand] = useState(null);
  const [handHistory, setHandHistory] = useState([]);

  const [bet, setBet] = useState(10);
  const [startingBankroll, setStartingBankroll] = useState(500);

  const updateHandHistory = (newHand) => {
    setHandHistory((prev) => [...prev, newHand]);
  };
  const updateBankroll = (balance) => {
    setSession((prev) => ({ ...prev, ["playerBankroll"]: balance }));
  };

  console.log(session);

  return (
    <div id="screen">
      <SessionManager
        session={session}
        updateSession={setSession}
        endSession={() => console.log("todo")}
        updateBankroll={updateBankroll}
      />
      {session?.createdAt && (
        <Table
          sessionId={session?.sessionId}
          hand={hand}
          setHand={setHand}
          startingBankroll={startingBankroll}
          updateBankroll={updateBankroll}
          updateHistory={updateHandHistory}
          bet={bet}
          updateBet={setBet}
        />
      )}
      {undefined && <HandHistroy handHistory={handHistory} />}
    </div>
  );
}

export default BlackjackScreen;
