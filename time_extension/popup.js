
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
// function decrementInterval(){
//     breakInterval = setInterval(updateTimeElements,1000);
// }

// Attach event listener to the "Break" button
breakBtn.addEventListener("click", () => {
    clearInterval(interval);
    chrome.storage.local.get(["timer"], (res) => {
        const currentTime = res.timer ?? 0;
        const breakCountdownValue = Math.floor(currentTime / 5); // Calculate the break countdown value

        // Save the break countdown value in storage
        chrome.storage.local.set({
            breakCountdown: breakCountdownValue,
        });
        chrome.storage.local.set({
            isRunning: false,
        });
        // chrome.storage.local.set({
        //     breakRunning:true,
        // })
        
        // Trigger the startBreakCountdown function with the calculated value
        chrome.runtime.sendMessage({ action: "startBreakCountdown", breakCountdownValue });
        //startMainInterval();
    });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateBreakCountdownDisplay") {
        const countdown = message.countdown;
        const formattedCountdown = formatTime(countdown); // Format the countdown value
        timerElement.textContent = `Break Time: ${formattedCountdown}`;
    }
});


// Listen for messages from the background script to update the timer display
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "updateTimerDisplay") {
//         timerElement.textContent = `Break Time: ${formatTime(message.time)}`;
//     }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "updateTimerDisplay") {
//         timerElement.textContent = `Break Time: ${formatTime(message.countdown)}`;
//     }
// });


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startBreakCountdown") {
        const breakCountdownValue = message.breakCountdownValue;
        startBreakCountdown(breakCountdownValue);
    }
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

// breakBtn.addEventListener("click", () => {
//     chrome.storage.local.set({
//       isRunning: false,
//     });
    
//     clearInterval(interval); // Clear the main timer interval
  
//     // Grab the current time from the timer and divide it by 5
//     chrome.storage.local.get(["timer"], (res) => {
//       const currentTime = res.timer ?? 0;
//       const breakTime = Math.floor(currentTime / 5);
  
//       // Set the break countdown time
//       breakCountdown = breakTime;
//       //isBreakCountdownActive = true; // Set the flag to true
//       chrome.storage.local.set({
//         isBreakRunning: true,
//     });
  
//       breakInterval = setInterval(() => {
//         if (breakCountdown > 0) {
//           breakCountdown--;
//           timerElement.textContent = `Break Time: ${formatTime(breakCountdown)}`;
//           chrome.action.setBadgeText({
//             text: `${formatTime(breakCountdown)}`,
//           });
//         } else {
//           clearInterval(breakInterval);
//           timerElement.textContent = "Break is over!";
//           chrome.storage.local.set({
//             timer: 0,
//             isRunning: false,
//           });
//           if (breakCountdown === 0) {
//             chrome.notifications.create("breakOverNotification", {
//               type: "basic",
//               iconUrl: "Flowmodoro.png",
//               title: "Break Over",
//               message: "Your break time is over!",
//             });
//           }
  
//           //isBreakCountdownActive = false; // Set the flag to false
//             chrome.storage.local.set({
//             isBreakRunning: true,
//         });
//           startMainInterval(); // Restart the main timer interval
//         }
//       }, 1000);
//     });
//   });