let randomNumber;
let attempts = 0;
const maxAttempts = 10;

// DOM elements
let guessInput, checkBtn, message, resetBtn;

// 🔥 Start Game (GLOBAL)
window.startGame = function () {
    const name = document.getElementById("playerName").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    document.getElementById("nameScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    resetGame(); // start fresh
    loadLeaderboard();
};

document.addEventListener("DOMContentLoaded", function () {

    guessInput = document.getElementById("guessInput");
    checkBtn = document.getElementById("checkBtn");
    message = document.getElementById("message");
    resetBtn = document.getElementById("resetBtn");

    checkBtn.addEventListener("click", checkGuess);
    resetBtn.addEventListener("click", resetGame);

    generateRandomNumber(); // initial
});

// 🎲 Generate number
function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * 50) + 1;
    console.log("Random:", randomNumber);
}

// 🔍 Check guess
function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 50) {
        message.textContent = "Enter a number between 1 and 50.";
        return;
    }

    attempts++;

    if (userGuess === randomNumber) {
        const name = document.getElementById("playerName").value;

        // Save to Firebase
        if (name !== "" && window.db) {
            import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
            .then(async ({ addDoc, collection }) => {
                await addDoc(collection(window.db, "scores"), {
                    name: name,
                    attempts: attempts
                });

                loadLeaderboard();
            });
        }

        message.textContent = `🎉 ${name}, you guessed it in ${attempts} attempts!`;
        endGame();

    } else if (userGuess < randomNumber) {
        message.textContent = "Too low!";
    } else {
        message.textContent = "Too high!";
    }

    if (attempts >= maxAttempts && userGuess !== randomNumber) {
        message.textContent = `You lost! Number was ${randomNumber}`;
        endGame();
    }
}

// 🏆 Leaderboard
async function loadLeaderboard() {
    try {
        const { getDocs, collection, query, orderBy, limit } =
            await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const q = query(
            collection(window.db, "scores"),
            orderBy("attempts"),
            limit(10)
        );

        const snapshot = await getDocs(q);

        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = "";

        let rank = 1;

        snapshot.forEach((doc) => {
            const data = doc.data();

            const li = document.createElement("li");

            let medal = "";
            if (rank === 1) medal = "🥇";
            else if (rank === 2) medal = "🥈";
            else if (rank === 3) medal = "🥉";

            li.textContent = `${medal} ${rank}. ${data.name} - ${data.attempts} tries`;

            leaderboard.appendChild(li);
            rank++;
        });

    } catch (error) {
        console.error("Leaderboard error:", error);
    }
}

// 🛑 End game
function endGame() {
    guessInput.disabled = true;
    checkBtn.disabled = true;
    resetBtn.style.display = "block";
}

// 🔄 Reset game (FIXED)
function resetGame() {
    attempts = 0;

    if (guessInput) guessInput.value = "";
    if (guessInput) guessInput.disabled = false;
    if (checkBtn) checkBtn.disabled = false;
    if (message) message.textContent = "";
    if (resetBtn) resetBtn.style.display = "none";

    generateRandomNumber(); // safe call
}
