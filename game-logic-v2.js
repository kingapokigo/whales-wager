console.log("🐳 Whale’s Wager JS v2.3 Loaded");
const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let currentRoll = 0;
let boardSpaces = [];

function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = "";
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = `${i + 1}`;
    if (i === 79) {
      space.classList.add("final-tile");
    }
    boardSpaces.push(space);
  }

  const rowSize = 10;
  for (let i = 0; i < boardSpaces.length; i += rowSize) {
    let row = boardSpaces.slice(i, i + rowSize);
    const rowNumber = Math.floor(i / rowSize);
    if (rowNumber % 2 !== 0) row.reverse();
    row.forEach(tile => boardTrack.appendChild(tile));
  }

  console.log("✅ Total tiles rendered:", boardSpaces.length);
}

function createPlayerTokens() {
  const tokenContainer = document.getElementById("player-tokens");
  tokenContainer.innerHTML = ""; // Clear previous tokens
  
  const inputs = document.querySelectorAll(".player-input input");
  players = [];

  inputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      const token = document.createElement("div");
      token.classList.add("whale-token");
      token.setAttribute("data-position", "0");
      token.innerHTML = `<img src="images/${getWhaleImage(index)}" alt="Player ${index + 1} Whale">`;

      const player = {
        name,
        token,
        position: 0,
        skipsTurn: false,
      };

      players.push(player);

      // ✅ Place token directly on tile 1 (index 0)
      boardSpaces[0].appendChild(token);
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
  return colors[index % colors.length];
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
  const space = boardSpaces[newPosition];
  space.appendChild(player.token);

  setTimeout(() => drawCard(player), 500);
}

function drawCard(player) {
  playSound?.(); // if you have a sound function!
  const isToxic = Math.random() < 0.4;
  const card = document.getElementById("card-output");
  card.classList.remove("hidden");

  if (isToxic) {
    const consequence = getRandomToxicChallenge();
    card.innerHTML = `<div class="toxic-card"><h2>🍄 Toxic Mushroom Card</h2><p>${consequence}</p></div>`;
    handleToxicEffect(player, consequence);
  } else {
    const challenge = getRandomWhaleChallenge();
    card.innerHTML = `<div class="whale-card"><h2>🐋 Whale Card</h2><p>${challenge}</p></div>`;
  }

  setTimeout(() => nextPlayer(), 3000);
}

function handleToxicEffect(player, consequence) {
  if (consequence.includes("Skip your next turn")) {
    player.skipsTurn = true;
  } else if (consequence.includes("Move back")) {
    const match = consequence.match(/Move back (\d+)/);
    if (match) {
      const stepsBack = parseInt(match[1]);
      player.position = Math.max(0, player.position - stepsBack);
      const space = boardSpaces[player.position];
      space.appendChild(player.token);
    }
  }
}

function getRandomWhaleChallenge() {
  const challenges = [
    "Chug a beer 🍺",
    "Do 10 push-ups!",
    "Name 5 Mets players 🧢",
    "Trivia: What’s Jake’s favorite team?",
    "30-second push-up contest!",
    "Make your best whale call 🐋",
    "Create a fake ESPN headline 📰",
    "Take a sip of your drink 🥂",
    "Swap seats with someone 🔄"
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function getRandomToxicChallenge() {
  const consequences = [
    "Move back 3 spaces!",
    "Skip your next turn.",
    "Return to START!",
    "Lose your next dice roll!",
    "Everyone else moves forward 1 space!"
  ];
  return consequences[Math.floor(Math.random() * consequences.length)];
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}
