chrome.alarms.create({
  periodInMinutes: 1 / 60,
});

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(["timer", "isRunning"], (res) => {
    const time = res.timer ?? 0;
    const isRunning = res.isRunning ?? true;
    if (!isRunning) {
      return;
    }
    chrome.storage.local.set({
      timer: time + 1,
    });
    chrome.action.setBadgeText({
      text: `${formatTime(time + 1)}`,
    });
    chrome.storage.sync.get(["notificationTime"], (res) => {
      const notificationTime = res.notificationTime ?? 1000;
      if (time % notificationTime == 0) {
        this.registration.showNotification("Flowmodoro Timer", {
          body: `You have been focused for ${notificationTime} seconds!`,
          icon: "koi_timer.png",
        });
      }
    });
  });
});
