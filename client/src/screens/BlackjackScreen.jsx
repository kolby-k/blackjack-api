import React, { useEffect, useState } from "react";
import SessionManager from "../components/SessionManager";
import HandHistroy from "../components/HandHistroy";
import Table from "../components/Table";

function BlackjackScreen() {
  const [session, setSession] = useState({ playerBankroll: 500 });
  const [hand, setHand] = useState(null);
  const [handHistory, setHandHistory] = useState([]);

  const [bet, setBet] = useState(10);

  const updateHandHistory = (newHand) => {
    setHandHistory((prev) => [...prev, newHand]);
  };
  const updateBankroll = (balance) => {
    setSession((prev) => ({ ...prev, ["playerBankroll"]: balance }));
  };

  const endSession = () => {
    console.log("TODO");
    setHand(null);
  };

  useEffect(() => {
    if (bet > session.playerBankroll) {
      setBet(session.playerBankroll);
    }
  }, [session]);

  return (
    <div id="screen">
      <SessionManager
        session={session}
        updateSession={setSession}
        endSession={endSession}
        netChange={hand?.netGain}
      />
      {session?.createdAt && (
        <Table
          sessionId={session?.sessionId}
          hand={hand}
          setHand={setHand}
          playerBankroll={session?.playerBankroll}
          updateBankroll={updateBankroll}
          updateHistory={updateHandHistory}
          bet={bet}
          updateBet={setBet}
          endSession={endSession}
        />
      )}
      {undefined && <HandHistroy handHistory={handHistory} />}
    </div>
  );
}

export default BlackjackScreen;
