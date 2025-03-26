<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Whale's Wager</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <header>
      <h1>🐋 Whale's Wager 🐋</h1>
    </header>

    <!-- Player Setup -->
    <section id="setup">
      <h2>Name Your Whales</h2>
      <div id="player-setup">
        <div class="player-entry">
          <input type="text" placeholder="Player 1 Name" class="player-name">
          <img src="/images/whale1.png" class="whale-icon">
        </div>
        <div class="player-entry">
          <input type="text" placeholder="Player 2 Name" class="player-name">
          <img src="/images/whale2.png" class="whale-icon">
        </div>
        <div id="add-player">+ Add Player</div>
        <button id="start-game">Start Game</button>
      </div>
    </section>

    <!-- Main Game Board -->
    <section id="game-board" class="hidden">
      <div id="board"></div>

      <div id="game-controls">
        <button id="roll-dice">🎲 Roll Dice</button>
        <div id="dice-result"></div>
        <button id="draw-card">🃏 Draw Card</button>
        <button id="draw-mushroom">🍄 Draw Toxic Mushroom</button>
      </div>

      <div id="card-display" class="card"></div>

      <!-- Player Info -->
      <div id="player-info"></div>
    </section>

    <!-- End Game Modal -->
    <div id="end-game" class="modal hidden">
      <div class="modal-content">
        <h2>Game Over!</h2>
        <p id="winner-announcement"></p>
        <button onclick="location.reload()">Play Again</button>
      </div>
    </div>
  </div>

  <script>
    let players = [];
    let currentPlayerIndex = 0;
    const boardSize = 20; // Total board positions

    const cards = [
      "Sing a sea shanty for 15 seconds.",
      "Swap whales with another player.",
      "Tell a fishy joke.",
      "Do 10 pushups or move back 2 spaces.",
      "Name 5 sea creatures in 10 seconds.",
      "Compliment every player.",
      "Walk like a crab for the next turn.",
      "Imitate a whale sound. Loudly.",
      "Do the worm or take a mushroom card.",
      "Declare your allegiance to Whale Nation!"
    ];

    const mushroomCards = [
      "Lose a turn.",
      "Go back 3 spaces.",
      "Trade places with last-place player.",
      "Let others vote who moves you back 4 spaces.",
      "Spin around 10 times before your next move.",
      "Make a whale pun or move back 2 spaces.",
      "Give your best evil villain laugh. Or skip next turn.",
      "Hold a plank until your next turn starts.",
      "Whale Jail! Miss 1 turn.",
      "You now speak only in whale noises for 1 round."
    ];

    function startGame() {
      const playerNames = document.querySelectorAll('.player-name');
      players = [];
      playerNames.forEach((input, index) => {
        if (input.value.trim()) {
          players.push({
            name: input.value.trim(),
            position: 0,
            icon: `/images/whale${index + 1}.png`
          });
        }
      });
      if (players.length < 2) {
        alert("At least 2 whales must join the wager!");
        return;
      }
      document.getElementById("setup").classList.add("hidden");
      document.getElementById("game-board").classList.remove("hidden");
      renderBoard();
      updatePlayerInfo();
    }

    function rollDice() {
      const roll = Math.floor(Math.random() * 6) + 1;
      document.getElementById("dice-result").textContent = `Rolled: ${roll}`;
      const player = players[currentPlayerIndex];
      player.position = (player.position + roll) % boardSize;
      renderBoard();
      checkWin();
      nextPlayer();
    }

    function drawCard() {
      const cardText = cards[Math.floor(Math.random() * cards.length)];
      document.getElementById("card-display").textContent = cardText;
    }

    function drawMushroom() {
      const cardText = mushroomCards[Math.floor(Math.random() * mushroomCards.length)];
      document.getElementById("card-display").textContent = cardText;
    }

    function nextPlayer() {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      updatePlayerInfo();
    }

    function checkWin() {
      const player = players[currentPlayerIndex];
      if (player.position >= boardSize - 1) {
        document.getElementById("winner-announcement").textContent = `${player.name} wins the wager!`;
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
        players.forEach(player => {
          if (player.position === i) {
            const img = document.createElement("img");
            img.src = player.icon;
            img.alt = player.name;
            img.className = "whale-icon-tiny";
            tile.appendChild(img);
          }
        });
        board.appendChild(tile);
      }
    }

    function updatePlayerInfo() {
      const info = document.getElementById("player-info");
      info.innerHTML = players.map((p, i) => `<p>${i === currentPlayerIndex ? '▶️' : ''} ${p.name} - Space ${p.position}</p>`).join("");
    }

    document.getElementById("start-game").addEventListener("click", startGame);
    document.getElementById("roll-dice").addEventListener("click", rollDice);
    document.getElementById("draw-card").addEventListener("click", drawCard);
    document.getElementById("draw-mushroom").addEventListener("click", drawMushroom);
  </script>
</body>
</html>
