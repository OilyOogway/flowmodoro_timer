// //creates a chrome alarm that will fire every second
// chrome.alarms.create({
//   periodInMinutes: 1 / 60,
// });

// //formats time and returns it in user frienly interface
// function formatTime(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;

//   return `${hours.toString().padStart(2, "0")}:${minutes
//     .toString()
//     .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// }

// //This code responds to alarms by listening for them
// //The callback grabs the timer and isRunning values from chrome local storage
// chrome.alarms.onAlarm.addListener((alarm) => {
//   chrome.storage.local.get(["timer", "isRunning"], (res) => {
//     const time = res.timer ?? 0;
//     const isRunning = res.isRunning ?? true;
//     //if its not running return
//     if(!isRunning && timer > 0){
//         chrome.storage.local.set({
//             timer: time - 1,
//         })
//     }
//     if (!isRunning) {
//       return;
//     }

//     //update time in storage by one as well as the badge
//     chrome.storage.local.set({
//       timer: time + 1,
//     });
//     chrome.action.setBadgeText({
//       text: `${formatTime(time + 1)}`,
//     });

//   });
// });

// // This code should go in your background script (background.js)

// // This function will handle the break countdown logic
// function startBreakCountdown() {
//     chrome.storage.local.get(["breakCountdown", "isBreakRunning"], (res) => {
//         const breakCountdown = res.breakCountdown ?? 0;
//         const isBreakRunning = res.isBreakRunning ?? false;

//         if (isBreakRunning && breakCountdown > 0) {
//             chrome.storage.local.set({
//                 breakCountdown: breakCountdown - 1,
//             });

//             // Send a message to update the timer display in the popup
//             chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: breakCountdown - 1 });

//             // Check if the break is over
//             if (breakCountdown === 1) {
//                 clearInterval(breakInterval);

//                 // Display a notification
//                 chrome.notifications.create("breakOverNotification", {
//                     type: "basic",
//                     iconUrl: "Flowmodoro.png",
//                     title: "Break Over",
//                     message: "Your break time is over!",
//                 });

//                 // Reset break-related values
//                 chrome.storage.local.set({
//                     isBreakRunning: false,
//                     breakCountdown: 0,
//                 });

//                 // Send a message to update the timer display to "Break is over!"
//                 chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: "Break is over!" });
//             }
//         }
//     });
// }

// // Listen for messages from the popup script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "startBreakCountdown") {
//         startBreakCountdown();
//     }
// });

// This function will handle the break countdown logic
function startBreakCountdown(breakCountdownValue) {
    console.log("startBreakCountdown function called"); // Debug: Add this line

    let breakCountdown = breakCountdownValue;

    console.log("Initial Break countdown:", breakCountdown); // Debug: Add this line

    // Update the timer display in the popup with the initial break countdown value
    chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: breakCountdown });

    // Reset the timer to 0
    chrome.storage.local.set({ timer: 0 });

    console.log("Timer reset to 0"); // Debug: Add this line

    // Start the break countdown interval
    breakInterval = setInterval(() => {
        if (breakCountdown > 0) {
            breakCountdown--;

            // Update the timer display in the popup
            chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: breakCountdown });

            // Update badge text
            chrome.action.setBadgeText({ text: `${formatTime(breakCountdown)}` });

            console.log("Break countdown:", breakCountdown); // Debug: Add this line
        } else {
            clearInterval(breakInterval);

            // Display a notification
            chrome.notifications.create("breakOverNotification", {
                type: "basic",
                iconUrl: "Flowmodoro.png",
                title: "Break Over",
                message: "Your break time is over!",
            });

            console.log("Break is over!"); // Debug: Add this line

            // Reset break-related values
            chrome.storage.local.set({
                isBreakRunning: false,
                breakCountdown: 0,
            });

            // Send a message to update the timer display to "Break is over!"
            chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: "Break is over!" });
        }
    }, 1000);
}


// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startBreakCountdown") {
        const breakCountdownValue = message.breakCountdownValue;
        startBreakCountdown(breakCountdownValue);
    }
});

// ...


// This function will handle the alarm event
function handleAlarm(alarm) {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
        const time = res.timer ?? 0;
        const isRunning = res.isRunning ?? true;

        if (!isRunning && time > 0) {
            chrome.storage.local.set({
                timer: time - 1,
            });
        }

        if (isRunning) {
            // Update time in storage by one as well as the badge
            chrome.storage.local.set({
                timer: time + 1,
            });
            chrome.action.setBadgeText({
                text: `${formatTime(time + 1)}`,
            });
        }
    });
}

// // Listen for messages from the popup script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("start break message recieved");
//     if (message.action === "startBreakCountdown") {
//         startBreakCountdown();
//     }
// });

// Listen for alarms
chrome.alarms.onAlarm.addListener(handleAlarm);

// This function formats time and returns it in a user-friendly interface
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}


