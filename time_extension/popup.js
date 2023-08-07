const timeElement = document.getElementById("time");
const nameElement = document.getElementById("name");
const timerElement = document.getElementById("timer");

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTimeElements() {
  chrome.storage.local.get(["timer"], (res) => {
    const time = res.timer ?? 0;
    const formattedTime = formatTime(time);
    timerElement.textContent = `${formattedTime}`;
  });
}

updateTimeElements();
setInterval(updateTimeElements, 1000);

// chrome.storage.sync.get(["name"], (res) => {
//   const name = res.name ?? "???";
//   nameElement.textContent = `Your name is: ${name}`;
// });

const startStopBtn = document.getElementById("start-stop");
//const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const breakBtn = document.getElementById("break");

startStopBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    const isRunning = res.isRunning ?? false;

    // Toggle the value of isRunning
    const newIsRunning = !isRunning;

    chrome.storage.local.set({
      isRunning: newIsRunning,
    });

    if (newIsRunning) {
      startStopBtn.textContent = "Stop Timer";
    } else {
      startStopBtn.textContent = "Start Timer";
    }
  });
});

resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
  });
});

let countdownInterval;
let breakCountdown; // Add a variable to track the countdown time

// Event listener for the "Break" button
breakBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: false,
  });

  //clearInterval(countdownInterval); // Clear the ongoing timer interval

  // Grab the current time from the timer and divide it by 5
  chrome.storage.local.get(["timer"], (res) => {
    const currentTime = res.timer ?? 0;
    const breakTime = Math.floor(currentTime / 5);

    // Set the break countdown time
    breakCountdown = breakTime;

    // Start counting down the break time
    countdownInterval = setInterval(() => {
      if (breakCountdown > 0) {
        breakCountdown--;
        timerElement.textContent = `Break Time: ${formatTime(breakCountdown)}`;
      } else {
        clearInterval(countdownInterval);
        timerElement.textContent = "Break is over!";
        chrome.storage.local.set({
          timer: 0,
          isRunning: false,
        });
      }
    }, 1000);
  });
});
