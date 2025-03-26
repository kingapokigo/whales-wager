const boardSize = 70;
let players = [];
let currentPlayerIndex = 0;
let currentRoll = 0;
let boardSpaces = [];

function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = ""; // Clear any existing spaces
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = `🌊 ${i + 1}`;
    boardSpaces.push(space);
    boardTrack.appendChild(space);
  }
}

function createPlayerTokens() {
  const tokenContainer = document.getElementById("player-tokens");
  tokenContainer.innerHTML = "";

  const inputs = document.querySelectorAll(".player-input input");
  players = [];

  inputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      const token = document.createElement("div");
      token.classList.add("whale-token");
      token.setAttribute("data-position", "0");
      token.innerHTML = `<img src="${getWhaleImage(index)}" alt="Player ${index + 1} Whale">`;

      players.push({
        name,
        token,
        position: 0,
        skipsTurn: false,
      });

      tokenContainer.appendChild(token);
    }
  });

  updateCurrentPlayerDisplay();
}

function getWhaleImage(index) {
  const colors = [
    "black-whale.png",
    "green-whale.png",
    "blue-whale.png",
    "purple-whale.png",
    "teal-whale.png",
    "pink-whale.png"
  ];
  return `images/${colors[index % colors.length]}`;
}

function rollDice() {
  const player = players[currentPlayerIndex];
  if (player.skipsTurn) {
    alert(`${player.name} is skipping this turn! 💤`);
    player.skipsTurn = false;
    nextPlayer();
    return;
  }

  currentRoll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-image").src = `images/dice-${currentRoll}.png`;
  document.getElementById("dice-result").textContent = `${player.name} rolled a ${currentRoll}!`;

  movePlayer(player, currentRoll);
}

function movePlayer(player, steps) {
  let newPosition = player.position + steps;

  if (newPosition >= boardSize) {
    alert(`🎉 ${player.name} has reached the end and WON Whale's Wager!`);
    document.getElementById("current-player").textContent = `${player.name} WINS! 🎉`;
    return;
  }

  player.position = newPosition;

  const boardTrack = document.getElementById("dynamic-board-track");
  const space = boardSpaces[newPosition];
  space.appendChild(player.token);

  setTimeout(() => {
    drawCard(player);
  }, 500);
}

function drawCard(player) {
  playSound();

  const isToxic = Math.random() < 0.4; // 40% chance it's a toxic mushroom card
  const card = document.getElementById("card-output");
  card.classList.remove("hidden");

  if (isToxic) {
    const consequence = getRandomToxicChallenge();
    card.innerHTML = `
      <div class="toxic-card">
        <h2>🍄 Toxic Mushroom Card</h2>
        <p>${consequence}</p>
      </div>
    `;
    handleToxicEffect(player, consequence);
  } else {
    const challenge = getRandomWhaleChallenge();
    card.innerHTML = `
      <div class="whale-card">
        <h2>🐋 Whale Card</h2>
        <p>${challenge}</p>
      </div>
    `;
  }

  setTimeout(() => {
    nextPlayer();
  }, 3000);
}

function handleToxicEffect(player, consequence) {
  if (consequence.includes("Skip your next turn")) {
    player.skipsTurn = true;
  } else if (consequence.includes("Move back")) {
    const match = consequence.match(/Move back (\d+)/);
    if (match) {
      const stepsBack = parseInt(match[1]);
      player.position = Math.max(0, player.position - stepsBack);
      const boardTrack = document.getElementById("dynamic-board-track");
      const space = boardSpaces[player.position];
      space.appendChild(player.token);
    }
  }
}

function getRandomWhaleChallenge() {
  const challenges = [
    "Do 10 push-ups or drink 3 sips!",
    "Compliment the player to your left!",
    "Tell a funny memory or lose a turn.",
    "Trade places with the player furthest behind!",
    "Make a whale sound for 10 seconds 🐋🎤",
    "Invent a sea creature dance or do 15 jumping jacks!",
    "Sing part of your favorite guilty pleasure song!",
    "Tell everyone your most irrational fear!",
    "Play rock-paper-scissors with someone. Loser takes a sip!",
    "Make a rule everyone must follow for the rest of the game!"
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function getRandomWhaleChallenge() {
  const challenges = [
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
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}
