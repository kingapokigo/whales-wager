function drawCard() {
  const cards = [
    "Chug a beer 🍺",
    "Do 10 pushups 💪",
    "Name 5 Mets players ⚾️",
    "Text your crush 😳",
    "Make up a new team chant 🎤",
    "Do a silly dance for 15 seconds 💃",
    "Take a selfie with a serious face 🤳",
    "Trivia time! What’s Jake’s middle name? 🧠",
    "Take a sip of your drink 🥂",
    "Swap seats with someone 🔄"
  ];

  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];

  document.getElementById("card-output").innerText = card;
}
