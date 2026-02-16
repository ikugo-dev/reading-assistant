const playBtn = document.getElementById("playBtn");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

playBtn.addEventListener("click", () => togglePlay());
rewindBtn.addEventListener("click", () => rewind());
forwardBtn.addEventListener("click", () => forward());
speedSlider.addEventListener("input", (e) => updateSpeed(e));
volumeSlider.addEventListener("input", (e) => updateVolume(e));

function togglePlay() {
    console.log("Play/Pause toggled");
    // TODO
}

function rewind() {
    console.log("Rewind 10 seconds");
    // TODO
}

function forward() {
    console.log("Forward 10 seconds");
    // TODO
}

function updateSpeed(event) {
    const value = event.target.value;
    speedValue.textContent = `${parseFloat(value).toFixed(1)}x`;
    console.log("Speed changed to:", value);
    // TODO
}

function updateVolume(event) {
    const value = event.target.value;
    volumeValue.textContent = `${value}%`;
    console.log("Volume changed to:", value);
    // TODO
}
