const playBtn = document.getElementById("playBtn");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const languageSelect = document.getElementById("languageSelect");
const fontSelect = document.getElementById("fontSelect");
const textContentEl = document.getElementById("textContent");

playBtn.addEventListener("click", () => togglePlay());
rewindBtn.addEventListener("click", () => rewind());
forwardBtn.addEventListener("click", () => forward());
speedSlider.addEventListener("input", (e) => updateSpeed(e));
volumeSlider.addEventListener("input", (e) => updateVolume(e));
languageSelect.addEventListener("change", () => onLanguageChange());
fontSelect.addEventListener("change", () => applyFont());

let utterance = null;
let isSpeaking = false;
let isPaused = false;

let textIndex = 0;          
const JUMP_CHARS = 350;        

function getText() {
  return (textContentEl?.innerText || "").trim();
}

let availableVoices = [];

function loadVoices() {
  availableVoices = speechSynthesis.getVoices() || [];
}
loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function pickBestVoiceForLang(lang) {
  const voices = availableVoices.length ? availableVoices : speechSynthesis.getVoices();
  if (!voices || !voices.length) return null;

  const normLang = (lang || "").toLowerCase();

  const matches = (v) => (v.lang || "").toLowerCase() === normLang || (v.lang || "").toLowerCase().startsWith(normLang);

  const qualityScore = (v) => {
    const name = (v.name || "").toLowerCase();
    let score = 0;
    if (name.includes("neural") || name.includes("natural") || name.includes("premium")) score += 100;
    if (name.includes("google")) score += 60;
    if (name.includes("microsoft")) score += 30;
    if (v.default) score += 10;
    return score;
  };

  const candidates = voices.filter(matches);
  if (!candidates.length) return null;

  candidates.sort((a, b) => qualityScore(b) - qualityScore(a));
  return candidates[0];
}

function getSelectedLang() {
  return languageSelect?.value || "en-US";
}

function buildUtterance(fromIndex = 0) {
  const full = getText();
  if (!full) return null;

  const slice = full.slice(fromIndex);

  const u = new SpeechSynthesisUtterance(slice);

  u.rate = parseFloat(speedSlider.value);

  u.volume = parseInt(volumeSlider.value, 10) / 100;

  const lang = getSelectedLang();
  u.lang = lang;

  const bestVoice = pickBestVoiceForLang(lang);
  if (bestVoice) {
    u.voice = bestVoice;
    u.lang = bestVoice.lang; 
  }

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

function applyFont() {
  const value = fontSelect?.value || "lexend";

  textContentEl.classList.remove(
    "font-lexend",
    "font-arial",
    "font-verdana",
    "font-times",
    "font-opendyslexic"
  );

  textContentEl.classList.add(`font-${value}`);
}

function onLanguageChange() {
  if (isSpeaking) startSpeaking(textIndex);
}

globalThis.onTextReady = () => {
  textIndex = 0;
  speechSynthesis.cancel();
  isSpeaking = false;
  isPaused = false;
  playBtn.textContent = "Play";
  applyFont();
};