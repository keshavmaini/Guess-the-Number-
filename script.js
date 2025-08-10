let randomNumber;
let attempts = 0;
const maxAttempts = 10;

const guessInput = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * 50) + 1; // Generates a number between 1 and 50.
    console.log("Random number (for debugging):", randomNumber); //  For debugging purposes only
}

function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    // Validate input
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 50) {
        message.textContent = "Please enter a valid number between 1 and 50.";
        return;
    }

    attempts++;

    if (userGuess === randomNumber) {
        message.textContent = `Congratulations! You guessed the number ${randomNumber} in ${attempts} attempts!`;
        endGame(true);
    } else if (userGuess < randomNumber) {
        message.textContent = "Too low! Try again.";
    } else {
        message.textContent = "Too high! Try again.";
    }

    if (attempts >= maxAttempts && userGuess !== randomNumber) {
        message.textContent = `You ran out of attempts! The number was ${randomNumber}.`;
        endGame(false);
    }
}

function endGame(won) {
    guessInput.disabled = true;
    checkBtn.disabled = true;
    resetBtn.style.display = "block";
}

function resetGame() {
    attempts = 0;
    guessInput.value = "";
    guessInput.disabled = false;
    checkBtn.disabled = false;
    message.textContent = "";
    resetBtn.style.display = "none";
    generateRandomNumber();
}

checkBtn.addEventListener("click", checkGuess);
resetBtn.addEventListener("click", resetGame);

// Initial game setup
generateRandomNumber();
