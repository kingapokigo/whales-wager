console.log("🐳 Whale’s Wager JS v2.3 Loaded");
const boardSize = 80;
let players = [];
let currentPlayerIndex = 0;
let currentRoll = 0;
let boardSpaces = [];

// Create board tiles
function createBoardSpaces() {
  const boardTrack = document.getElementById("dynamic-board-track");
  boardTrack.innerHTML = "";
  boardSpaces = [];

  for (let i = 0; i < boardSize; i++) {
    const space = document.createElement("div");
    space.classList.add("board-space");
    space.textContent = `${i + 1}`;
    if (i === 79) space.classList.add("final-tile");
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

// Create whale tokens and assign to tile 0
function createPlayerTokens() {
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

      // ✅ Add token to tile 0 (the first tile on the board)
      if (boardSpaces[0]) {
        boardSpaces[0].appendChild(token);
      } else {
        console.error("🚨 boardSpaces[0] does not exist!");
      }
    }
  });

  updateCurrentPlayerDisplay();
}

// Pick whale color/image
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

// Handle dice roll
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

// Move the whale
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

  playLandingSound();

  setTimeout(() => drawCard(player), 500);
}

// Draw card and display challenge
function drawCard(player) {
  playSound?.();

  const card = document.getElementById("game-card");
  const titleEl = document.getElementById("card-title");
  const textEl = document.getElementById("card-challenge-text");

  const isToxic = Math.random() < 0.4;
  if (isToxic) {
    const consequence = getRandomToxicChallenge();
    titleEl.innerHTML = "🍄 Toxic Mushroom Card";
    textEl.textContent = consequence;
    handleToxicEffect(player, consequence);
  } else {
    const challenge = getRandomWhaleChallenge();
    titleEl.innerHTML = "🐋 Whale Card";
    textEl.textContent = challenge;
  }

  card.classList.add("flipped"); // Flip the card!

  setTimeout(() => {
    nextPlayer();
    card.classList.remove("flipped"); // Unflip for next turn
  }, 3000);
}
function flipCard(cardEl) {
  cardEl.classList.toggle("flipped");

  // Optional: dynamically load a challenge
  const challenge = getRandomWhaleChallenge(); // Use your actual challenge function!
  const textEl = cardEl.querySelector("#card-challenge-text");
  if (textEl) textEl.textContent = challenge;
}

// Toxic effects like skip turn or move back
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

// Whale card ideas
function getRandomWhaleChallenge() {
  const challenges = [
    "Chug a beer 🍺",
    "Impersonate Jake giving a TED Talk on why the Knicks are winning it all 🎤",
    "Name 5 Mets players 🧢 (no repeats!)",
    "Trivia time! What’s Jake’s favorite team of all time?",
    "Pushup contest with the person to your left. Loser sips 🍻",
    "Make your best whale mating call. Loud. 🐋🔊",
    "Create a fake ESPN headline about someone in the room 📰",
    "Whale’s Choice: He picks someone to finish their drink 🐋🥂",
    "Take a sip of your drink 🥂",
    "Swap seats with someone 🔄"
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

// Toxic card ideas
function getRandomToxicChallenge() {
  const consequences = [
    "Move back 3 spaces!",
    "Skip your next turn.",
    "Swap spots with a player of your choice. 😈",
    "Return to START and rethink your life choices.",
    "Answer a truth... or move back 2 spaces!",
    "Lose your next dice roll. Roll a 1 no matter what!",
    "Everyone but you gets to move forward 1 space.",
    "Do 15 squats or go back 4 spaces!",
    "Repeat your last challenge again.",
    "Hold your breath for 15 seconds or skip your turn!"
  ];
  return consequences[Math.floor(Math.random() * consequences.length)];
}

// Switch to next player
function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateCurrentPlayerDisplay();
}

// Update current player's turn display
function updateCurrentPlayerDisplay() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `🎯 ${player.name}'s turn!`;
}

// 🔊 Play movement sound
function playLandingSound() {
  const sound = document.getElementById("draw-sound");
  if (sound) sound.play();
}

// ✨ Call this from your HTML button
function startGame() {
  document.getElementById("player-setup").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
  document.getElementById("card-output").classList.remove("hidden");

  createBoardSpaces(); // render tiles first
  setTimeout(() => {
    createPlayerTokens(); // then place whales
  }, 0);
}
