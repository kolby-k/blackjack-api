async function startNewSession() {
  try {
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/blackjack/sessions`,
      options
    );

    if (!response.ok) {
      throw Error("Error establishing a new session");
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error("Error: ", e);
    return null;
  }
}

async function dealNewHand({ sessionId, bet }) {
  try {
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ bet }),
    };
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/blackjack/sessions/${sessionId}/hands`,
      options
    );

    if (!response.ok) {
      throw Error("Error dealing a new hand");
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error("Error: ", e);
    return null;
  }
}

async function playerAction({ handId, action }) {
  try {
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/blackjack/hands/${handId}/${action}`,
      options
    );

    if (!response.ok) {
      throw Error("Error with player action");
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error("Error: ", e);
    return null;
  }
}

export default { startNewSession, dealNewHand, playerAction };
