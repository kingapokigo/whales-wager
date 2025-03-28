// 🧠 Whale's Wager Game Engine vFINAL - Fully Functional

console.log("🐳 Whale’s Wager Game Engine vFINAL Loaded");

const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let currentRoll = 0;
let boardSpaces = [];
let isAnimating = false;

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
      token.innerHTML = `<img src="images/${getWhaleColor(index)}" alt="Whale ${index + 1}">`;
      players.push({ name, token, position: 0, skipsTurn: false });
      tokenContainer.appendChild(token);
      boardSpaces[0].appendChild(token);
    }
  });
  updateCurrentPlayerDisplay();
}

function getWhaleColor(index) {
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
  if (isAnimating) return;
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
  animatePlayerMovement(player, currentRoll);
}

function animatePlayerMovement(player, steps) {
  isAnimating = true;
  let target = Math.min(boardSize - 1, player.position + steps);
  let path = [];
  for (let i = player.position + 1; i <= target; i++) {
    path.push(i);
  }

  function stepMove(i) {
    if (i >= path.length) {
      player.position = target;
      if (player.position === boardSize - 1) {
        document.getElementById("current-player").textContent = `🎉 ${player.name} WINS WHALE'S WAGER!!! 🐳`;
        alert(`🎉 ${player.name} made it to the final tile and wins the game!`);
        isAnimating = false;
        return;
      }
      setTimeout(() => drawCard(player), 400);
      isAnimating = false;
      return;
    }
    boardSpaces[path[i]].appendChild(player.token);
    setTimeout(() => stepMove(i + 1), 300);
  }

  stepMove(0);
}

function drawCard(player) {
  playSound();
  const card = document.getElementById("card-output");
  card.classList.remove("hidden");
  const isToxic = Math.random() < 0.4;
  const cardText = isToxic ? getToxicCard() : getWhaleCard();
  card.innerHTML = `
    <div class="${isToxic ? 'toxic-card' : 'whale-card'}">
      <h2>${isToxic ? '🍄 Toxic Mushroom Card' : '🐋 Whale Card'}</h2>
      <p>${cardText}</p>
    </div>
  `;
  if (isToxic) applyToxicEffect(player, cardText);
  setTimeout(() => {
    card.classList.add("hidden");
    nextPlayer();
  }, 4000);
}

function getWhaleCard() {
  const cards = [
    "Make your best whale call! 🐋",
    "Compliment another player.",
    "Tell a sea-themed joke.",
    "Trivia: What's Jake's favorite sport?",
    "Spin around 5 times, then act like a dolphin!",
    "Take a sip if you’ve been to the beach this year.",
    "High-five every player!",
    "Whale’s Choice: Pick someone to roll again.",
    "Name 3 sea creatures in 5 seconds!",
    "Sing one line from your favorite song 🎶"
  ];
  return cards[Math.floor(Math.random() * cards.length)];
}

function getToxicCard() {
  const cards = [
    "Move back 3 spaces!",
    "Skip your next turn.",
    "Swap spots with another player.",
    "Return to START!",
    "Do 15 jumping jacks or move back 4 spaces.",
    "Roll a 1 next turn no matter what.",
    "Everyone else moves forward 1 space.",
    "Repeat your last challenge.",
    "Hold your breath until your next turn!",
    "Spin in a circle while saying 'I love whales!'"
  ];
  return cards[Math.floor(Math.random() * cards.length)];
}

function applyToxicEffect(player, text) {
  if (text.includes("Skip")) {
    player.skipsTurn = true;
  } else if (text.includes("Move back")) {
    const steps = parseInt(text.match(/\d+/)[0]);
    player.position = Math.max(0, player.position - steps);
    boardSpaces[player.position].appendChild(player.token);
  } else if (text.includes("Return to START")) {
    player.position = 0;
    boardSpaces[0].appendChild(player.token);
  } else if (text.includes("Swap")) {
    const others = players.filter(p => p !== player);
    if (others.length === 0) return;
    const other = others[Math.floor(Math.random() * others.length)];
    const temp = player.position;
    player.position = other.position;
    other.position = temp;
    boardSpaces[player.position].appendChild(player.token);
    boardSpaces[other.position].appendChild(other.token);
  } else if (text.includes("Everyone else")) {
    players.forEach(p => {
      if (p !== player) {
        p.position = Math.min(boardSize - 1, p.position + 1);
        boardSpaces[p.position].appendChild(p.token);
      }
    });
  }
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}
