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

let paragraphIndex = 0;

function highlightParagraph(index) {
    document.querySelectorAll("#textContent p").forEach((p) =>
        p.classList.remove("speaking")
    );

    const el = document.getElementById(`paragraph${index}`);
    if (!el) return;

    el.classList.add("speaking");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearHighlight() {
    document.querySelectorAll("#textContent p").forEach((p) =>
        p.classList.remove("speaking")
    );
}

function buildUtterance(index) {
    const text = paragraphs[index].trim();
    if (!text) return null;

    const u = new SpeechSynthesisUtterance(text);

    u.rate = parseFloat(speedSlider.value);
    u.volume = parseInt(volumeSlider.value, 10) / 100;
    u.lang = "sr-RS";

    u.onstart = () => {
        isSpeaking = true;
        isPaused = false;
        playBtn.textContent = "Pause";
        highlightParagraph(index);
    };

    u.onend = () => {
        if (isManualChange) {
            isManualChange = false; // consume the flag here
            return;
        }

        paragraphIndex = index + 1;
        if (paragraphIndex < paragraphs.length) {
            startSpeaking(paragraphIndex);
        } else {
            isSpeaking = false;
            isPaused = false;
            playBtn.textContent = "Play";
            clearHighlight();
        }
    };

    u.onerror = () => {
        isSpeaking = false;
        isPaused = false;
        playBtn.textContent = "Play";
        clearHighlight();
    };

    return u;
}

let isManualChange = false;
function startSpeaking(from = 0) {
    isManualChange = true;
    speechSynthesis.cancel();
    // isManualChange = false;

    utterance = buildUtterance(from);
    if (!utterance) return;

    speechSynthesis.speak(utterance);
}

function togglePlay() {
    if (!paragraphs.length) {
        alert("Nema teksta za čitanje. Unesite tekst na početnoj strani.");
        return;
    }

    if (!isSpeaking) {
        startSpeaking(paragraphIndex);
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

globalThis.onTextReady = () => {
    paragraphIndex = 0;
    speechSynthesis.cancel();
    isSpeaking = false;
    isPaused = false;
    playBtn.textContent = "Play";
};
