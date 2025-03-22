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
