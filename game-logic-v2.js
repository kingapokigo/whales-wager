console.log("🐳 Whale’s Wager JS v2.4 Loaded");
const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let boardSpaces = [];

// Build the game board tiles
function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = "";
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = ${i + 1};
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

// Place player tokens on the starting tile
function createPlayerTokens() {
  const inputs = document.querySelectorAll(".player-input input");
  players = [];

  inputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      const token = document.createElement("div");
      token.classList.add("whale-token");
      token.setAttribute("data-position", "0");
      token.innerHTML = <img src="images/${getWhaleImage(index)}" alt="Player ${index + 1} Whale">;

      const player = {
        name,
        token,
        position: 0,
        skipsTurn: false,
      };

      players.push(player);
      boardSpaces[0].appendChild(token);
    }
  });

  updateCurrentPlayerDisplay();
}

// Get whale image
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

  // 💡 Reset card UI to default front
  card.classList.remove("flipped");
  titleEl.innerHTML = "🐋 Whale Card";
  textEl.textContent = "Click to flip!";
  card.classList.add("hidden"); // Hide it until whale lands

  if (player.skipsTurn) {
    alert(${player.name} skips this turn!);
    player.skipsTurn = false;
    nextPlayer();
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-image").src = images/dice-${roll}.png;
  document.getElementById("dice-result").textContent = ${player.name} rolled a ${roll}!;
  movePlayer(player, roll);
}

// Move the whale
function movePlayer(player, steps) {
  let newPosition = player.position + steps;
  if (newPosition >= boardSize) {
    alert(🎉 ${player.name} wins Whale's Wager!);
    document.getElementById("current-player").textContent = ${player.name} WINS! 🎉;
    return;
  }

  player.position = newPosition;
  boardSpaces[newPosition].appendChild(player.token);

  playLandingSound();

  setTimeout(() => {
    drawCard(player);
  }, 500);
}

// Card draw logic
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

// Handle toxic card effects
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

// Whale card challenges
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

// Toxic card challenges
function getRandomToxicChallenge() {
  const consequences = [
    "Move back 3 spaces!", "Skip your next turn.",
    "Swap spots with a player of your choice 😈",
    "Return to START and rethink your life choices.",
    "Answer a truth... or move back 2 spaces!",
    "Lose your next dice roll. Roll a 1 no matter what!",
    "Everyone but you moves forward 1 space.",
    "Do 15 squats or go back 4 spaces!",
    "Repeat your last challenge.", "Hold your breath for 15 seconds or skip your turn!"
  ];
  return consequences[Math.floor(Math.random() * consequences.length)];
}

// Flip card manually
function flipCard(cardEl) {
  cardEl.classList.toggle("flipped");
}

// Update current player display
function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = ${player.name}'s turn!;
}

// Advance to next player
function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

// Sound on landing
function playLandingSound() {
  const sound = document.getElementById("draw-sound");
  if (sound) sound.play();
}

// Start game!
function startGame() {
  document.getElementById("player-setup").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
  document.getElementById("card-output").classList.remove("hidden");
  createBoardSpaces();
  setTimeout(() => {
    createPlayerTokens();
  }, 0);
}
const jellyfishTiles = [7, 23, 48];   // Tile numbers where the zap happens
const whirlpoolTiles = [15, 36, 66];  // Tile numbers for swap surprise
if (jellyfishTiles.includes(player.position)) {
  alert("⚡ Zapped by a Jellyfish! Move back 3 spaces!");
  player.position = Math.max(0, player.position - 3);
  boardSpaces[player.position].appendChild(player.token);
}

if (whirlpoolTiles.includes(player.position)) {
  const otherPlayer = players.find(p => p !== player && p.position < player.position);
  if (otherPlayer) {
    alert("🌀 Caught in a Whirlpool! Swapping places!");
    let tempPos = player.position;
    player.position = otherPlayer.position;
    otherPlayer.position = tempPos;
    boardSpaces[player.position].appendChild(player.token);
    boardSpaces[otherPlayer.position].appendChild(otherPlayer.token);
  } else {
    alert("🌀 Whirlpool tried to swap you—but you're in last place! You lose your next turn.");
    player.skipsTurn = true;
  }
}
