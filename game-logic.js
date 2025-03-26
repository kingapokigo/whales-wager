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

function getPlayerNames() {
  const inputs = document.querySelectorAll(".player-input input");
  return Array.from(inputs)
    .map((input) => input.value.trim())
    .filter((name) => name !== "");
}

let currentPlayerIndex = 0;
let playerPositions = [];
const boardSize = 50;
const trapSpaces = [13, 37];

function createBoardSpaces() {
  const boardTrack = document.querySelector(".board-track");
  boardTrack.innerHTML = "";

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("space");
    space.id = `space-${i}`;
    if (i === 0) space.innerText = "Start";
    else if (i === boardSize - 1) {
      space.innerText = "Finish 🎉";
      space.classList.add("finish");
    } else if (trapSpaces.includes(i)) {
      space.innerText = "🍄";
      space.classList.add("trap");
    }
    boardTrack.appendChild(space);
  }
}

function createPlayerTokens() {
  const playerInputs = document.querySelectorAll(".player-selection .player-input");
  const tokensContainer = document.getElementById("player-tokens");
  tokensContainer.innerHTML = "";
  playerPositions = [];

  playerInputs.forEach((inputBlock, index) => {
    const input = inputBlock.querySelector("input");
    const name = input.value.trim();

    if (name !== "") {
      const imgElement = inputBlock.querySelector("img");
      const img = document.createElement("img");
      img.src = imgElement.src;
      img.alt = name;
      img.classList.add("whale-token");
      img.dataset.playerIndex = playerPositions.length;

      playerPositions.push(0); // Start at space-0
      document.getElementById("space-0").appendChild(img);
    }
  });
}

function rollDice() {
  if (playerPositions.length === 0) return;

  const roll = Math.floor(Math.random() * 6) + 1;

  // Update dice image
  const diceImg = document.getElementById("dice");
  diceImg.src = `images/dice-${roll}.png`;

  // Display text result
  document.getElementById("dice-result").innerText = `You rolled a ${roll}!`;

  // Move whale
  movePlayer(currentPlayerIndex, roll);

  // Update player turn
  currentPlayerIndex = (currentPlayerIndex + 1) % playerPositions.length;

  // Optional: update whose turn it is
  const nextPlayer = document.querySelector(`.whale-token[data-player-index='${currentPlayerIndex}']`);
  if (nextPlayer) {
    document.getElementById("current-player").innerText = `It's ${nextPlayer.alt}'s turn!`;
  }
}

function movePlayer(index, steps) {
  let currentPos = playerPositions[index];
  let newPos = currentPos + steps;
  if (newPos >= boardSize) newPos = boardSize - 1;

  if (trapSpaces.includes(newPos)) {
    newPos = Math.max(newPos - 4, 0);
  }

  playerPositions[index] = newPos;
  const space = document.getElementById(`space-${newPos}`);
  const token = document.querySelector(`.whale-token[data-player-index='${index}']`);
  space.appendChild(token);

  if (newPos === boardSize - 1) {
    alert(`🎉 ${token.alt} wins the game! 🎉`);
  }
}

window.onload = () => {
  createBoardSpaces();
};
if (trapSpaces.includes(newPos)) {
  alert(`${token.alt} hit a 🍄 toxic mushroom and moves back 4 spaces!`);
  newPos = Math.max(newPos - 4, 0);
}
document.getElementById("current-player").innerText = `It's ${token.alt}'s turn!`;
let gameOver = false;

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-result").innerText = `You rolled a ${roll}!`;

  movePlayer(currentPlayerIndex, roll);

  const playerNames = getPlayerNames();
  const nextIndex = (currentPlayerIndex + 1) % playerPositions.length;
  const nextPlayer = playerNames[nextIndex];
  document.getElementById("current-player").innerText = `🎯 ${nextPlayer}'s Turn!`;

  currentPlayerIndex = nextIndex;
}
function movePlayer(index, steps) {
  // ...existing code...
  if (newPos === boardSize - 1) {
    alert(`🎉 ${token.alt} wins the game! 🎉`);
    gameOver = true;
  }
}
