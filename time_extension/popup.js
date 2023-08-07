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
    timerElement.textContent = `The timer is at: ${formattedTime}`;
  });
}

updateTimeElements();
setInterval(updateTimeElements, 1000);

// chrome.storage.sync.get(["name"], (res) => {
//   const name = res.name ?? "???";
//   nameElement.textContent = `Your name is: ${name}`;
// });

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

startBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: true,
  });
});

stopBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: false,
  });
});

resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
  });
});
