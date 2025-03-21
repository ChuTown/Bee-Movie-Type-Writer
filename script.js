let c = 0;
const count = document.getElementById("count");

let hasStarted = false;
let startTime;
let timerInterval;
let continueToCalculateWordsPerMinute = false;
let selectedLines = "";

function inc() {
    c++;
    update();
}

function dec() {
    c--;
    update();
}

function update() {
    count.textContent = c;
}

async function displayBeeMovieScript() {
    resetTimer();
    let beeMovieScript = await gettingRandomBeeMovieTranscript(); 
    document.getElementById("script").textContent = beeMovieScript;

    const textbox = document.getElementById("textbox");
    textbox.disabled = false; 
    textbox.value = ""; 
    textbox.style.backgroundColor = "";
}


async function gettingRandomBeeMovieTranscript() {
    try {
        const response = await fetch('beeScript.txt');
        const data = await response.text();
        const lines = data.split("\n").filter(line => line.trim() !== "");

        const maxRange = lines.length;
        const maxStartIndex = maxRange - 3;

        if (maxStartIndex < 0) return "Error: Not enough lines in the file.";

        const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
        selectedLines = lines.slice(startIndex, startIndex + 3).join(" ");
        console.log("Selected:", selectedLines);
        return selectedLines;
    } catch (error) {
        console.error("Error loading file:", error);
        return "Error fetching the script.";
    }
}

function getUserInputLive() {
    document.getElementById("textbox").addEventListener("input", function () {
        const input = this.value;
        const lengthOfInput = input.length;
        const lengthOfSelected = selectedLines.length;

        if (!selectedLines) {
            this.style.backgroundColor = "lightcoral";
            return;
        }

        if (!hasStarted && lengthOfInput > 0) {
            hasStarted = true;
            startTime = Date.now();
            continueToCalculateWordsPerMinute = true;
            startTimer();
        }

        let isMatching = true;
        for (let i = 0; i < lengthOfInput; i++) {
            if (input[i] !== selectedLines[i]) {
                isMatching = false;
                break;
            }
        }

        if (isMatching && lengthOfInput <= lengthOfSelected) {
            this.style.backgroundColor = "lightgreen";
        } else {
            this.style.backgroundColor = "lightcoral";
        }

        if (continueToCalculateWordsPerMinute) {
            calculateWordsPerMinute();
        }

        if (isMatching && lengthOfInput === lengthOfSelected) {
            continueToCalculateWordsPerMinute = false;
            clearInterval(timerInterval);
            calculateWordsPerMinute();
        
            const textbox = document.getElementById("textbox");
            textbox.style.backgroundColor = "lightgreen";
            textbox.disabled = true; 
        }
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById("timer").textContent = `Time: ${elapsedTime} seconds`;
    }, 100); 
}

function resetTimer() {
    hasStarted = false;
    continueToCalculateWordsPerMinute = false;
    clearInterval(timerInterval);
    document.getElementById("timer").textContent = "Time: 0.0 seconds";
    document.getElementById("WPM").textContent = "Rate: 0 words per minute";
}

function calculateWordsPerMinute() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime > 0) {
        const words = countWords(selectedLines);
        const wordsPerMinute = Math.round(words / (elapsedTime / 60));
        document.getElementById("WPM").textContent = `Rate: ${wordsPerMinute} words per minute`;
    }
}

function countWords(str) {
    return str.trim().split(/\s+/).length;
}

getUserInputLive();
