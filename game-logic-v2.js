console.log("🐳 Whale’s Wager JS v2.5 Loaded");
const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let boardSpaces = [];

const jellyfishTiles = [7, 23, 48];
const whirlpoolTiles = [15, 36, 66];

function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = "";
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = `${i + 1}`;
    if (jellyfishTiles.includes(i)) space.classList.add("jellyfish-tile");
    if (whirlpoolTiles.includes(i)) space.classList.add("whirlpool-tile");
    if (i === boardSize - 1) space.classList.add("final-tile");
    boardSpaces.push(space);
  }

  const rowSize = 10;
  for (let i = 0; i < boardSpaces.length; i += rowSize) {
    const row = boardSpaces.slice(i, i + rowSize);
    if (Math.floor(i / rowSize) % 2 !== 0) row.reverse();
    row.forEach(tile => boardTrack.appendChild(tile));
  }
}

function createPlayerTokens() {
  const inputs = document.querySelectorAll(".player-input input");
  players = [];

  inputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      const token = document.createElement("div");
      token.classList.add("whale-token");
      token.innerHTML = `<img src="images/${getWhaleImage(index)}" alt="Whale">`;

      const player = {
        name,
        token,
        position: 0,
        skipsTurn: false
      };

      players.push(player);
      boardSpaces[0].appendChild(token);
    }
  });

  updateCurrentPlayerDisplay();
}

function getWhaleImage(index) {
  const colors = [
    "black-whale.png", "green-whale.png", "blue-whale.png",
    "purple-whale.png", "teal-whale.png", "pink-whale.png"
  ];
  return colors[index % colors.length];
}

function rollDice() {
  const player = players[currentPlayerIndex];
  const card = document.getElementById("game-card");
  const titleEl = document.getElementById("card-title");
  const textEl = document.getElementById("card-challenge-text");

  // Reset card
  card.classList.remove("flipped");
  titleEl.innerHTML = "🐋 Whale Card";
  textEl.textContent = "Click to flip!";
  card.classList.add("hidden");

  if (player.skipsTurn) {
    alert(`${player.name} skips this turn!`);
    player.skipsTurn = false;
    nextPlayer();
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-image").src = `images/dice-${roll}.png`;
  document.getElementById("dice-result").textContent = `${player.name} rolled a ${roll}!`;

  movePlayer(player, roll);
}

function movePlayer(player, steps) {
  let newPosition = player.position + steps;
  if (newPosition >= boardSize) {
    alert(`🎉 ${player.name} wins Whale's Wager!`);
    document.getElementById("current-player").textContent = `${player.name} WINS! 🎉`;
    return;
  }

  player.position = newPosition;
  boardSpaces[newPosition].appendChild(player.token);
  playLandingSound();

  // Handle tile effects
  if (jellyfishTiles.includes(player.position)) {
    alert("⚡ Zapped by a Jellyfish! Move back 3 spaces!");
    player.position = Math.max(0, player.position - 3);
    boardSpaces[player.position].appendChild(player.token);
  }

  if (whirlpoolTiles.includes(player.position)) {
    const otherPlayer = players.find(p => p !== player && p.position < player.position);
    if (otherPlayer) {
      alert("🌀 Caught in a Whirlpool! Swapping places!");
      const temp = player.position;
      player.position = otherPlayer.position;
      otherPlayer.position = temp;
      boardSpaces[player.position].appendChild(player.token);
      boardSpaces[otherPlayer.position].appendChild(otherPlayer.token);
    } else {
      alert("🌀 Whirlpool tried to swap you—but you're in last place! You lose your next turn.");
      player.skipsTurn = true;
    }
  }

  setTimeout(() => {
    drawCard(player);
  }, 500);
}

function drawCard(player) {
  const card = document.getElementById("game-card");
  const titleEl = document.getElementById("card-title");
  const textEl = document.getElementById("card-challenge-text");

  const isToxic = Math.random() < 0.4;
  titleEl.innerHTML = isToxic ? "🍄 Toxic Mushroom Card" : "🐋 Whale Card";
  textEl.textContent = isToxic ? getRandomToxicChallenge() : getRandomWhaleChallenge();

  card.classList.remove("hidden");
  card.classList.add("flipped");

  if (isToxic) handleToxicEffect(player, textEl.textContent);

  setTimeout(() => {
    card.classList.remove("flipped");
    card.classList.add("hidden");
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
      boardSpaces[player.position].appendChild(player.token);
    }
  }
}

function getRandomWhaleChallenge() {
  const challenges = [
    "Chug a beer 🍺", "Name 5 Mets players 🧢",
    "Make your best whale mating call 🐋🔊", "Take a sip of your drink 🥂",
    "Pushup contest with the player to your left 💪", "Create a fake ESPN headline 📰",
    "Trivia: What’s Jake’s favorite team?", "Swap seats with someone 🔄",
    "Whale’s Choice: Pick someone to finish their drink 🐋", "Dance like a jellyfish for 15 seconds 🕺"
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function getRandomToxicChallenge() {
  const consequences = [
    "Move back 3 spaces!", "Skip your next turn.",
    "Swap spots with a player of your choice 😈", "Return to START and rethink your life choices.",
    "Answer a truth... or
