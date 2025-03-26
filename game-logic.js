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

function createPlayerTokens() {
  const playerInputs = document.querySelectorAll('.player-selection .player-input input');
  const tokenContainer = document.getElementById("player-tokens");

  tokenContainer.innerHTML = ''; // clear old tokens

  const positions = [
    { top: '2px', left: '2px' },
    { top: '2px', left: '35px' },
    { top: '30px', left: '2px' },
    { top: '30px', left: '35px' },
    { top: '16px', left: '18px' },
    { top: '16px', left: '50px' }
  ];

  playerInputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name !== '') {
      const img = document.createElement('img');
      img.src = input.previousElementSibling.src;
      img.alt = name;
      img.classList.add('player-token');
      img.style.position = 'absolute';
      img.style.width = '24px';
      img.style.height = '24px';
      img.style.borderRadius = '50%';
      img.style.top = positions[index].top;
      img.style.left = positions[index].left;

      const startSpace = document.getElementById("space-0");
      startSpace.appendChild(img);
    }
  });
}
// === WHALE MOVEMENT: BOARD GAME MECHANICS === //

const boardSize = 21; // 0 to 20
let currentPlayerIndex = 0;
let playerPositions = [];

function getPlayerNames() {
  const inputs = document.querySelectorAll(".player-input input");
  return Array.from(inputs)
    .map((input) => input.value.trim())
    .filter((name) => name !== "");
}

function createPlayerTokens() {
  const names = getPlayerNames();
  const tokensContainer = document.getElementById("player-tokens");
  tokensContainer.innerHTML = "";
  playerPositions = []; // Reset positions

  names.forEach((name, index) => {
    const img = document.createElement("img");
    img.src = document.querySelectorAll(".player-input img")[index].src;
    img.alt = name;
    img.classList.add("whale-token");
    img.dataset.playerIndex = index;
    tokensContainer.appendChild(img);
    playerPositions.push(0); // All whales start at space-0

    const startSpace = document.getElementById("space-0");
    startSpace.appendChild(img);
  });
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-result").innerText = `You rolled a ${roll}!`;

  movePlayer(currentPlayerIndex, roll);
  currentPlayerIndex = (currentPlayerIndex + 1) % playerPositions.length;
}

function movePlayer(index, steps) {
  const currentPos = playerPositions[index];
  let newPos = currentPos + steps;
  if (newPos > 20) newPos = 20;

  playerPositions[index] = newPos;

  const space = document.getElementById(`space-${newPos}`);
  const token = document.querySelector(
    `.whale-token[data-player-index='${index}']`
  );

  space.appendChild(token);

  if (newPos === 20) {
    alert(`🎉 ${token.alt} wins the game! 🎉`);
  }
}
