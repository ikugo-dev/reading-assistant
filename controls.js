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
    if (!paragraphs.length) {
        alert("Nema teksta za čitanje. Unesite tekst na početnoj strani.");
        return;
    }
    if (speechSynthesis.speaking) {
        stopSpeaking();
    } else {
        startSpeaking(paragraphIndex);
    }
}

function rewind() {
    if (!paragraphs.length) return;
    paragraphIndex = Math.max(0, paragraphIndex - 1);
    startSpeaking(paragraphIndex);
}

function forward() {
    if (!paragraphs.length) return;
    paragraphIndex = Math.min(paragraphs.length - 1, paragraphIndex + 1);
    startSpeaking(paragraphIndex);
}

function updateSpeed(event) {
    const value = event.target.value;
    speedValue.textContent = `${parseFloat(value).toFixed(1)}x`;

    if (isSpeaking) startSpeaking(paragraphIndex);
}

function updateVolume(event) {
    const value = event.target.value;
    volumeValue.textContent = `${value}%`;

    if (isSpeaking) startSpeaking(paragraphIndex);
}
