console.log("🐳 Whale’s Wager JS v3.0 - Fully Functional Candy Land Mode");

const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let currentRoll = 0;
let boardSpaces = [];

// === Setup the Game Board ===
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
    let row = boardSpaces.slice(i, i + rowSize);
    if (Math.floor(i / rowSize) % 2 !== 0) row.reverse();
    row.forEach(tile => boardTrack.appendChild(tile));
  }
}

// === Player Token Setup ===
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
      token.innerHTML = `<img src="${getWhaleImage(index)}" alt="Whale ${index + 1}">`;

      players.push({
        name,
        token,
        position: 0,
        skipsTurn: false,
      });

      tokenContainer.appendChild(token);
      boardSpaces[0].appendChild(token);
    }
  });

  updateCurrentPlayerDisplay();
}

// === Whale Images ===
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

// === Roll Dice and Move ===
function rollDice() {
  const player = players[currentPlayerIndex];
  if (player.skipsTurn) {
    alert(`${player.name} is skipping this turn! 🍄`);
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

  if (newPosition >= boardSize - 1) {
    newPosition = boardSize - 1;
    player.position = newPosition;
    boardSpaces[newPosition].appendChild(player.token);
    document.getElementById("current-player").textContent = `🎉 ${player.name} WINS WHALE'S WAGER!!! 🐳`;
    alert(`🎉 ${player.name} made it to the final tile and wins the game!`);
    return;
  }

  player.position = newPosition;
  boardSpaces[newPosition].appendChild(player.token);

  setTimeout(() => {
    drawCard(player);
  }, 600);
}

// === Card Drawing Logic ===
function drawCard(player) {
  playSound();
  const card = document.getElementById("card-output");
  card.classList.remove("hidden");

  const isToxic = Math.random() < 0.4;
  const message = isToxic ? getRandomToxicChallenge() : getRandomWhaleChallenge();
  const type = isToxic ? "toxic-card" : "whale-card";
  const title = isToxic ? "🍄 Toxic Mushroom Card" : "🐋 Whale Card";

  card.innerHTML = `
    <div class="${type}">
      <h2>${title}</h2>
      <p>${message}</p>
    </div>
  `;

  if (isToxic) handleToxicEffect(player, message);

  setTimeout(() => {
    card.classList.add("hidden");
    nextPlayer();
  }, 4000);
}

// === Handle Effects of Toxic Cards ===
function handleToxicEffect(player, consequence) {
  if (consequence.includes("Skip your next turn")) {
    player.skipsTurn = true;
  } else if (consequence.includes("Move back")) {
    const match = consequence.match(/Move back (\\d+)/);
    if (match) {
      const stepsBack = parseInt(match[1]);
      player.position = Math.max(0, player.position - stepsBack);
      boardSpaces[player.position].appendChild(player.token);
    }
  } else if (consequence.includes("Return to START")) {
    player.position = 0;
    boardSpaces[0].appendChild(player.token);
  } else if (consequence.includes("Swap spots")) {
    const others = players.filter(p => p !== player);
    const rand = others[Math.floor(Math.random() * others.length)];
    [player.position, rand.position] = [rand.position, player.position];
    boardSpaces[player.position].appendChild(player.token);
    boardSpaces[rand.position].appendChild(rand.token);
  }
}

// === Random Whale & Toxic Challenges ===
function getRandomWhaleChallenge() {
  const challenges = [
    "Do your best whale mating call 🐳🔊",
    "Tell a sea-themed joke 🌊",
    "Name 5 sea creatures in 10 seconds!",
    "Make a toast about friendship 🍻",
    "Compliment every player!",
    "Dance like a jellyfish for 10 seconds 🕺",
    "Act like a dolphin until your next turn 🐬",
    "Sing a line from your favorite song 🎶",
    "Trivia: What's Jake's favorite sport? 🧠",
    "Whale’s Choice: Pick someone to drink 🐋🥂"
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function getRandomToxicChallenge() {
  const consequences = [
    "Move back 3 spaces!",
    "Skip your next turn.",
    "Swap spots with a player of your choice. 😈",
    "Return to START and rethink your life choices.",
    "Answer a truth... or move back 2 spaces!",
    "Lose your next dice roll. Roll a 1 no matter what!",
    "Everyone but you gets to move forward 1 space.",
    "You’re poisoned! Do 15 squats or go back 4 spaces!",
    "Yikes! You have to repeat your last challenge again.",
    "Hold your breath for 15 seconds or skip your next turn!"
  ];
  return consequences[Math.floor(Math.random() * consequences.length)];
}

// === Player Turn Control ===
function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}
