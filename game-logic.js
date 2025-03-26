function drawCard() {
  const cards = [
    "Chug a beer 🍺",
    "Impersonate Jake giving a TED Talk on why the Knicks are winning it all 🎤",
    "Name 5 Mets players 🧢 (no repeats!)",
    "Trivia time! What’s Jake’s favorite team of all time?",
    "Challenge: 30-second pushup contest with the person to your left. Loser sips 🍻",
    "Make your best whale mating call. Loud. 🐋🔊",
    "Create a fake ESPN headline about someone in the room 📰",
    "Whale’s Choice: He picks someone to finish their drink 🐋🥂",
    "Take a sip of your drink 🥂",
    "Swap seats with someone 🔄"
  ];

  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];

  document.getElementById("card-output").innerText = card;
}

function createPlayerTokens() {
  const playerSetupDiv = document.querySelectorAll(".player-input");
  const playerTokensDiv = document.getElementById("player-tokens");
  playerTokensDiv.innerHTML = ""; // Clear previous tokens if any

  playerSetupDiv.forEach((div, index) => {
    const input = div.querySelector("input");
    const name = input.value.trim();
    if (name !== "") {
      const img = div.querySelector("img").getAttribute("src");
      const token = document.createElement("img");
      token.src = img;
      token.alt = name + "'s whale";
      token.classList.add("whale-token");
      token.dataset.playerIndex = index;
      token.dataset.position = "0"; // Starting space

      // Add the token to the Start space
      const startSpace = document.getElementById("space-0");
      startSpace.appendChild(token);
    }
  });
}
