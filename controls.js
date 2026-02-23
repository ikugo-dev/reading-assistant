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

let utterance = null;
let isSpeaking = false;
let isPaused = false;

let textIndex = 0;
const JUMP_CHARS = 350;

function getText() {
    return currentText.trim();
}

function buildUtterance(fromIndex = 0) {
    const full = getText();
    if (!full) return null;

    const slice = full.slice(fromIndex);

    const u = new SpeechSynthesisUtterance(slice);

    u.rate = parseFloat(speedSlider.value);

    u.volume = parseInt(volumeSlider.value, 10) / 100;

    u.lang = "sr-RS";

    u.onstart = () => {
        isSpeaking = true;
        isPaused = false;
        playBtn.textContent = "Pause";
    };

    u.onend = () => {
        isSpeaking = false;
        isPaused = false;
        playBtn.textContent = "Play";
    };

    u.onerror = () => {
        isSpeaking = false;
        isPaused = false;
        playBtn.textContent = "Play";
    };

    return u;
}

function startSpeaking(from = 0) {
    speechSynthesis.cancel();
    utterance = buildUtterance(from);
    if (!utterance) return;

    speechSynthesis.speak(utterance);
}

function togglePlay() {
    const text = getText();
    if (!text) {
        alert("Nema teksta za čitanje. Unesite tekst na početnoj strani.");
        return;
    }

    if (!isSpeaking) {
        startSpeaking(textIndex);
        return;
    }

    if (!isPaused) {
        speechSynthesis.pause();
        isPaused = true;
        playBtn.textContent = "Resume";
    } else {
        speechSynthesis.resume();
        isPaused = false;
        playBtn.textContent = "Pause";
    }
}

function rewind() {
    const text = getText();
    if (!text) return;

    textIndex = Math.max(0, textIndex - JUMP_CHARS);
    startSpeaking(textIndex);
}

function forward() {
    const text = getText();
    if (!text) return;

    textIndex = Math.min(text.length - 1, textIndex + JUMP_CHARS);
    startSpeaking(textIndex);
}

function updateSpeed(event) {
    const value = event.target.value;
    speedValue.textContent = `${parseFloat(value).toFixed(1)}x`;

    if (isSpeaking) startSpeaking(textIndex);
}

function updateVolume(event) {
    const value = event.target.value;
    volumeValue.textContent = `${value}%`;

    if (isSpeaking) startSpeaking(textIndex);
}

globalThis.onTextReady = () => {
    textIndex = 0;
    speechSynthesis.cancel();
    isSpeaking = false;
    isPaused = false;
    playBtn.textContent = "Play";
};
