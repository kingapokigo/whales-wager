console.log("🐳 Whale’s Wager JS v2.4 Loaded!");
const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let boardSpaces = [];

// 🧱 Create board tiles
function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = "";
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = `${i + 1}`;
    if (i === boardSize - 1) space.classList.add("final-tile");
    boardSpaces.push(space);
  }

  const rowSize = 10;
  for (let i = 0; i < boardSpaces.length; i += rowSize) {
    const row = boardSpaces.slice(i, i + rowSize);
    if ((i / rowSize) % 2 !== 0) row.reverse();
    row.forEach(tile => boardTrack.appendChild(tile));
  }
}

// 🐋 Create player tokens
function createPlayerTokens() {
  const inputs = document.querySelectorAll(".player-input input");
  players = [];

  inputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      const token = document.createElement("div");
      token.classList.add("whale-token");
      token.innerHTML = `<img src="images/${getWhaleImage(index)}" alt="${name}'s Whale">`;

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

// 🎨 Get whale image
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

// 🎲 Dice roll
function rollDice() {
  if (players.length === 0) return;

  const player = players[currentPlayerIndex];
  if (player.skipsTurn) {
    alert(`${player.name} is skipping this turn!`);
    player.skipsTurn = false;
    return nextPlayer();
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-image").src = `images/dice-${roll}.png`;
  movePlayer(player, roll);
}

// 🐾 Move the player
function movePlayer(player, steps) {
  const oldTile = boardSpaces[player.position];
  if (oldTile && oldTile.contains(player.token)) {
    oldTile.removeChild(player.token);
  }

  player.position += steps;
  if (player.position >= boardSize) {
    player.position = boardSize - 1;
    document.getElementById("current-player").textContent = `${player.name} WINS! 🎉`;
    alert(`🎉 ${player.name} reached the end and WINS!`);
    return;
  }

  boardSpaces[player.position].appendChild(player.token);
  playLandingSound();
  drawCard(player);
}

// 🃏 Draw a card
function drawCard(player) {
  const cardBox = document.getElementById("card-output");
  cardBox.classList.remove("hidden");

  const isToxic = Math.random() < 0.4;
  const type = isToxic ? "toxic" : "whale";
  const text = isToxic ? getRandomToxicChallenge() : getRandomWhaleChallenge();

  cardBox.innerHTML = `
    <div class="${type}-card card-inner" onclick="this.classList.toggle('flipped')">
      <div class="card-front">
        <h2>${type === "toxic" ? "🍄 Toxic Mushroom" : "🐋 Whale Card"}</h2>
        <p>Tap to reveal!</p>
      </div>
      <div class="card-back">
        <p>${text}</p>
        <button id="next-player-btn">Next Player ➡️</button>
      </div>
    </div>
  `;

  if (isToxic) {
    cardBox.dataset.toxicEffect = text;
    cardBox.dataset.playerName = player.name;
  }

  setTimeout(() => {
    const btn = document.getElementById("next-player-btn");
    if (btn) {
      btn.onclick = () => {
        if (isToxic) {
          const p = players.find(p => p.name === player.name);
          handleToxicEffect(p, text);
        }
        cardBox.innerHTML = "";
        nextPlayer();
      };
    }
  }, 100);
}

// 💀 Handle toxic card effects
function handleToxicEffect(player, text) {
  if (text.includes("Skip your next turn")) {
    player.skipsTurn = true;
  } else if (text.includes("Move back")) {
    const match = text.match(/Move back (\d+)/);
    if (match) {
      const stepsBack = parseInt(match[1]);
      const oldTile = boardSpaces[player.position];
      if (oldTile.contains(player.token)) oldTile.removeChild(player.token);
      player.position = Math.max(0, player.position - stepsBack);
      boardSpaces[player.position].appendChild(player.token);
    }
  }
}

// ✅ Whale card challenges
function getRandomWhaleChallenge() {
  return [
    "Do 10 jumping jacks!",
    "Impersonate Jake doing a TED Talk 🎤",
    "Make a whale mating call. Loud. 🐋🔊",
    "Swap seats with someone 🔁",
    "Take a sip of your drink 🍷"
  ][Math.floor(Math.random() * 5)];
}

// 🚫 Toxic card challenges
function getRandomToxicChallenge() {
  return [
    "Move back 3 spaces!",
    "Skip your next turn.",
    "Swap with a player of your choice.",
    "Return to START 🌀",
    "Hold your breath for 15 seconds or go back!"
  ][Math.floor(Math.random() * 5)];
}

// 🔁 Update turn display
function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}

// ⏩ Next player
function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

// 🔊 Landing sound
function playLandingSound() {
  const sound = document.getElementById("draw-sound");
  if (sound) sound.play();
}

// 🚀 Game start
function startGame() {
  document.getElementById("player-setup").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
  document.getElementById("card-output").classList.remove("hidden");
  document.getElementById("whale-track-label").classList.remove("hidden");

  createBoardSpaces();
  setTimeout(createPlayerTokens, 0);
}

window.startGame = startGame;
window.rollDice = rollDice;
