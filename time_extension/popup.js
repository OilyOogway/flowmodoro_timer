//grabs the h2 elements in the popup.html
const timeElement = document.getElementById("time");
const nameElement = document.getElementById("name");
const timerElement = document.getElementById("timer");

const startStopBtn = document.getElementById("start-stop");
const resetBtn = document.getElementById("reset");
const breakBtn = document.getElementById("break");

//formats time by inputting seconds and working with it returns a string
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

//retrieves time from google storage then displays it onto the timer h2
//element
function updateTimeElements() {
  chrome.storage.local.get(["timer"], (res) => {
    const time = res.timer ?? 0;
    const formattedTime = formatTime(time);
    timerElement.textContent = `${formattedTime}`;
  });
}

let interval; // Interval for main timer display
let breakInterval; // Interval for break countdown
let isBreakCountdownActive = false; // Flag to track break countdown status

function startMainInterval() {
  interval = setInterval(updateTimeElements, 1000);
}

startMainInterval();

// updateTimeElements();
// setInterval(updateTimeElements, 1000);

breakBtn.addEventListener("click", () => {
    chrome.storage.local.set({
      isRunning: false,
    });
  
    clearInterval(interval); // Clear the main timer interval
  
    // Grab the current time from the timer and divide it by 5
    chrome.storage.local.get(["timer"], (res) => {
      const currentTime = res.timer ?? 0;
      const breakTime = Math.floor(currentTime / 5);
  
      // Set the break countdown time
      breakCountdown = breakTime;
      isBreakCountdownActive = true; // Set the flag to true
  
      breakInterval = setInterval(() => {
        if (breakCountdown > 0) {
          breakCountdown--;
        //   breakTimerElement.style.display = "block"; // Show the break countdown element
          timerElement.textContent = `Break Time: ${formatTime(breakCountdown)}`;
          chrome.action.setBadgeText({
            text: `${formatTime(breakCountdown)}`,
          });
        } else {
          clearInterval(breakInterval);
          timerElement.textContent = "Break is over!";
          chrome.storage.local.set({
            timer: 0,
            isRunning: false,
          });
  
          isBreakCountdownActive = false; // Set the flag to false
          startMainInterval(); // Restart the main timer interval
        }
      }, 1000);
    });
  });


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
// breakBtn.addEventListener("click", () => {
//   chrome.storage.local.set({
//     isRunning: false,
//   });

//   //clearInterval(countdownInterval); // Clear the ongoing timer interval

//   // Grab the current time from the timer and divide it by 5
//   chrome.storage.local.get(["timer"], (res) => {
//     const currentTime = res.timer ?? 0;
//     const breakTime = Math.floor(currentTime / 5);

//     // Set the break countdown time
//     breakCountdown = breakTime;

//     // Start counting down the break time
//     countdownInterval = setInterval(() => {
//       if (breakCountdown > 0) {
//         breakCountdown--;
//         timerElement.textContent = `Break Time: ${formatTime(breakCountdown)}`;
//       } else {
//         clearInterval(countdownInterval);
//         timerElement.textContent = "Break is over!";
//         chrome.storage.local.set({
//           timer: 0,
//           isRunning: false,
//         });
//       }
//     }, 1000);
//   });
// });
