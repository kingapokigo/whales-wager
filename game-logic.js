// game-logic.js

let players = [];
let currentPlayerIndex = 0;
const boardSize = 20;
let turnCount = 0;

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

const mushroomCards = [
  "Lose a turn. Toxic Reef.",
  "Go back 5 spaces. Poison currents.",
  "All players but you roll again.",
  "Discard all power-ups.",
  "Beached! Remain still next turn.",
  "Get slimed: move backward until your next card is good.",
  "Do 10 jumping jacks. Refuse? Draw another mushroom.",
  "Stuck in a net! Choose a player to free you or miss next turn.",
  "Sing 'Under the Sea' — poorly — or take 2 mushroom cards.",
  "You are cursed by the Sea Witch! Everyone else moves forward 1."
];

function startGame() {
  const nameInputs = document.querySelectorAll('.player-name');
  players = [];
  nameInputs.forEach((input, i) => {
    const name = input.value.trim();
    if (name) {
      players.push({
        name,
        position: 0,
        powerUps: [],
        icon: `/images/whale${i + 1}.png`
      });
    }
  });
  if (players.length < 2) {
    alert("You need at least 2 whales to race!");
    return;
  }
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
  renderBoard();
  updatePlayerInfo();
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  const player = players[currentPlayerIndex];
  const doubleSwim = player.powerUps.includes("Double Swim!");
  const steps = doubleSwim ? roll * 2 : roll;
  player.position = (player.position + steps) % boardSize;

  document.getElementById("dice-result").textContent = `${player.name} rolled a ${roll}${doubleSwim ? " (Double Swim!)" : ""}`;
  if (doubleSwim) {
    player.powerUps = player.powerUps.filter(p => p !== "Double Swim!");
  }

  renderBoard();
  checkSpecialTile();
  checkWin();
  nextPlayer();
}

function drawCard() {
  const player = players[currentPlayerIndex];
  const card = cards[Math.floor(Math.random() * cards.length)];
  document.getElementById("card-display").textContent = card;

  if (card.includes("Double Swim") || card.includes("Ocean Shield") || card.includes("Free Swim")) {
    player.powerUps.push(card);
  }
}

function drawMushroom() {
  const player = players[currentPlayerIndex];
  const card = mushroomCards[Math.floor(Math.random() * mushroomCards.length)];
  if (player.powerUps.includes("Ocean Shield!")) {
    document.getElementById("card-display").textContent = `${card} (Blocked by Ocean Shield!)`;
    player.powerUps = player.powerUps.filter(p => p !== "Ocean Shield!");
  } else {
    document.getElementById("card-display").textContent = card;
    // Implement more mushroom logic here
  }
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updatePlayerInfo();
}

function checkWin() {
  const player = players[currentPlayerIndex];
  if (player.position >= boardSize * 2) {
    document.getElementById("winner-announcement").textContent = `${player.name} has conquered the sea!`;
    document.getElementById("end-game").classList.remove("hidden");
  }
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < boardSize; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = i;
    players.forEach(p => {
      if (p.position % boardSize === i) {
        const img = document.createElement("img");
        img.src = p.icon;
        img.alt = p.name;
        img.className = "whale-icon-tiny";
        tile.appendChild(img);
      }
    });
    board.appendChild(tile);
  }
}

function updatePlayerInfo() {
  const info = document.getElementById("player-info");
  info.innerHTML = players.map((p, i) => {
    const powerText = p.powerUps.length ? ` | 🛡️ ${p.powerUps.join(', ')}` : '';
    return `<p${i === currentPlayerIndex ? ' class="current-turn"' : ''}>${p.name} - Space ${p.position}${powerText}</p>`;
  }).join("");
}

function checkSpecialTile() {
  const tileEffects = ["draw-card", "draw-mushroom", "nothing", "draw-card", "draw-card", "draw-mushroom"];
  const player = players[currentPlayerIndex];
  const tileIndex = player.position % tileEffects.length;
  const effect = tileEffects[tileIndex];

  if (effect === "draw-card") drawCard();
  else if (effect === "draw-mushroom") drawMushroom();
  else document.getElementById("card-display").textContent = "Smooth sailing... for now.";
}

// Event Listeners
window.onload = () => {
  document.getElementById("start-game").addEventListener("click", startGame);
  document.getElementById("roll-dice").addEventListener("click", rollDice);
  document.getElementById("draw-card").addEventListener("click", drawCard);
  document.getElementById("draw-mushroom").addEventListener("click", drawMushroom);
};
