let c = 0
const count = document.getElementById("count");
 
function inc() {
    c = c + 1;
    update();
}

function dec() {
    c = c - 1;     
    update();
}

function update() {
    count.textContent = c;
}

async function displayBeeMovieScript() {
    let beeMovieScript = await gettingRandomBeeMovieTranscript(); 
    document.getElementById("script").textContent = beeMovieScript; 
    
    let textbox = document.getElementById("textbox");
    textbox.value = ""; 
    textbox.style.backgroundColor = "";
}

let selectedLines = "";
async function gettingRandomBeeMovieTranscript() {
    try {
        let response = await fetch('beeScript.txt'); // Fetch the file
        let data = await response.text(); // Convert to text
        let lines = data.split("\n").filter(line => line.trim() !== ""); // Remove empty lines

        let maxRange = lines.length; // Total number of lines
        let maxStartIndex = maxRange - 3; // Prevent overflow

        if (maxStartIndex < 0) {
            return "Error: Not enough lines in the file."; // Handle small files
        }

        let startIndex = Math.floor(Math.random() * (maxStartIndex + 1)); // Ensure within boundaries
        selectedLines = lines.slice(startIndex, startIndex + 3); // Get 5 consecutive lines 
       
        selectedLines = selectedLines.join(" ");
        console.log(selectedLines);
        return selectedLines;
    } 
    catch (error) {
        console.error('Error loading file:', error);
        return "Error fetching the script."; 
    }
}

let hasStarted = false; 
let startTime;
let timerInterval;

function getUserInputLive() {
    document.getElementById("textbox").addEventListener("input", function () {
        let lengthOfInput = this.value.length;
        let lengthOfSelected = selectedLines.length;

        if (hasStarted == false && lengthOfInput > 0) {
            hasStarted = true;
            startTime = Date.now();
            startTimer();
        }

        if (!selectedLines) {
            document.getElementById("textbox").style.backgroundColor = "lightcoral";
            return;
        }

        let isMatching = true; 

        for (let i = 0; i < lengthOfInput; i++) {
            if (this.value[i] !== selectedLines[i]) {
                isMatching = false;
                break;
            }
        }

        // stop timer when input matches all of the selected lines
        if (isMatching && lengthOfInput === lengthOfSelected) {
            clearInterval(timerInterval);
            document.getElementById("textbox").style.backgroundColor = "lightgreen";
            alert("Congratulations! You have finished the script.");
        } 

        if (isMatching && lengthOfInput <= lengthOfSelected) {
            document.getElementById("textbox").style.backgroundColor = "lightgreen";
        } else {
            document.getElementById("textbox").style.backgroundColor = "lightcoral";
        }
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1); 
        document.getElementById("timer").textContent = `Time: ${elapsedTime} seconds`;
    }, 100); 
}

function countWords(str) {
    return str.trim().split(/\s+/).length;
}

getUserInputLive();

