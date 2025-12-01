// Prevent animation on load
setTimeout(() => {
  document.body.classList.remove("preload");
}, 500);

// DOM
const btnRules = document.querySelector(".rules-btn");
const btnClose = document.querySelector(".close-btn");
const modalRules = document.querySelector(".modal");

const CHOICES = [
  {
    name: "paper",
    beats: "rock",
  },
  {
    name: "scissors",
    beats: "paper",
  },
  {
    name: "rock",
    beats: "scissors",
  },
];
const choiceButtons = document.querySelectorAll(".choice-btn");
const gameDiv = document.querySelector(".game");
const resultsDiv = document.querySelector(".results");
const resultDivs = document.querySelectorAll(".results__result");

const resultWinner = document.querySelector(".results__winner");
const resultText = document.querySelector(".results__text");

const playAgainBtn = document.querySelector(".play-again");

const yourscoreNumber = document.querySelector(".your_score__number");
const pcscoreNumber = document.querySelector(".pc_score__number");

let yourscore = parseInt(sessionStorage.getItem("yourScore")) || 0;
let PCscore = parseInt(sessionStorage.getItem("pcScore")) || 0;

// Update UI on load
yourscoreNumber.innerText = yourscore;
pcscoreNumber.innerText = PCscore;


// Game Logic
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choiceName = button.dataset.choice;
    const choice = CHOICES.find((choice) => choice.name === choiceName);
    choose(choice);
  });
});

function choose(choice) {
  const aichoice = aiChoose();
  displayResults([choice, aichoice]);
  displayWinner([choice, aichoice]);
}

function aiChoose() {
  const rand = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[rand];
}

function displayResults(results) {
  resultDivs.forEach((resultDiv, idx) => {
    setTimeout(() => {
      resultDiv.innerHTML = `
        <div class="choice ${results[idx].name}">
          <img src="images/icon-${results[idx].name}.svg" alt="${results[idx].name}" />
        </div>
      `;
    }, idx * 1000);
  });

  gameDiv.classList.toggle("hidden");
  resultsDiv.classList.toggle("hidden");
}

function displayWinner(results) {
  setTimeout(() => {
    const userWins = isWinner(results);
    const aiWins = isWinner(results.reverse());

    if (userWins) {
      resultText.innerText = "you win";
      resultDivs[0].classList.toggle("winner");

      // Update and save score (sessionStorage)
      yourScore(1);

      if (!document.getElementById("win-button")) {
        const winButton = document.createElement("button");
        winButton.id = "win-button";
        winButton.innerText = "NEXT";
        winButton.classList.add("win-button");
        winButton.addEventListener("click", () => {
          window.location.href = "win.html";
        });
        resultWinner.appendChild(winButton);
      }

    } else if (aiWins) {
      resultText.innerText = "you lose";
      resultDivs[1].classList.toggle("winner");

      // Update and save score (sessionStorage)
      PCScore(1);

    } else {
      resultText.innerText = "tie up";
    }

    resultWinner.classList.toggle("hidden");
    resultsDiv.classList.toggle("show-winner");

    // Remove NEXT button if not user win
    const winButton = document.getElementById("win-button");
    if (winButton && !userWins) {
      winButton.remove();
    }

  }, 1000);
}

function isWinner(results) {
  return results[0].beats === results[1].name;
}


// Save score to sessionStorage

function yourScore(point) {
  yourscore += point;
  sessionStorage.setItem("yourScore", yourscore);
  yourscoreNumber.innerText = yourscore;
}

function PCScore(point) {
  PCscore += point;
  sessionStorage.setItem("pcScore", PCscore);
  pcscoreNumber.innerText = PCscore;
}


// Play Again
playAgainBtn.addEventListener("click", () => {
  gameDiv.classList.toggle("hidden");
  resultsDiv.classList.toggle("hidden");

  resultDivs.forEach((resultDiv) => {
    resultDiv.innerHTML = "";
    resultDiv.classList.remove("winner");
  });

  resultText.innerText = "";
  resultWinner.classList.toggle("hidden");
  resultsDiv.classList.toggle("show-winner");
});

// Show/Hide Rules
btnRules.addEventListener("click", () => {
  modalRules.classList.toggle("show-modal");
});
btnClose.addEventListener("click", () => {
  modalRules.classList.toggle("show-modal");
});
