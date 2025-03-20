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
        return "Error fetching the script."; // Handle fetch errors
    }
}


