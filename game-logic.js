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
let gameOver = false;
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

      playerPositions.push(0);
      document.getElementById("space-0").appendChild(img);
    }
  });

  const playerNames = getPlayerNames();
  if (playerNames.length > 0) {
    document.getElementById("current-player").innerText = `🎯 ${playerNames[0]}'s Turn!`;
  }
}

function rollDice() {
  if (gameOver || playerPositions.length === 0) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-result").innerText = `You rolled a ${roll}!`;

  const diceImg = document.getElementById("dice");
  if (diceImg) {
    diceImg.src = `images/dice-${roll}.png`;
  }

  movePlayer(currentPlayerIndex, roll);

  const playerNames = getPlayerNames();
  const nextIndex = (currentPlayerIndex + 1) % playerPositions.length;
  const nextPlayer = playerNames[nextIndex];
  document.getElementById("current-player").innerText = `🎯 ${nextPlayer}'s Turn!`;

  currentPlayerIndex = nextIndex;
}

function movePlayer(index, steps) {
  let currentPos = playerPositions[index];
  let newPos = currentPos + steps;
  if (newPos >= boardSize) newPos = boardSize - 1;

  if (trapSpaces.includes(newPos)) {
    alert(`${getPlayerNames()[index]} hit a 🍄 toxic mushroom and moves back 4 spaces!`);
    newPos = Math.max(newPos - 4, 0);
  }

  playerPositions[index] = newPos;
  const space = document.getElementById(`space-${newPos}`);
  const token = document.querySelector(`.whale-token[data-player-index='${index}']`);
  space.appendChild(token);

  if (newPos === boardSize - 1) {
    alert(`🎉 ${token.alt} wins the game! 🎉`);
    gameOver = true;
  }
}

window.onload = () => {
  createBoardSpaces();
};
