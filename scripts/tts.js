let paragraphIndex = 0;
let currentGeneration = 0;

const playHTML = '<img class="icon" src="./icons/play.svg">';
const stopHTML = '<img class="icon" src="./icons/stop.svg">';

function speakParagraph(index, generation) {
    if (generation !== currentGeneration) return;
    if (index >= paragraphs.length) {
        clearHighlight();
        playBtn.innerHTML = playHTML;
        return;
    }

    const text = paragraphs[index].trim();
    if (!text) {
        paragraphIndex = index + 1;
        speakParagraph(index + 1, generation);
        return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.rate = parseFloat(speedSlider.value);
    u.volume = parseInt(volumeSlider.value, 10) / 100;
    u.lang = getSelectedLang();
    const bestVoice = pickBestVoiceForLang(u.lang);
    if (bestVoice) {
        u.voice = bestVoice;
        u.lang = bestVoice.lang;
    }

    u.onstart = () => {
        if (generation !== currentGeneration) return;
        highlightParagraph(index);
    };

    u.onend = () => {
        if (generation !== currentGeneration) return;
        paragraphIndex = index + 1;
        speakParagraph(paragraphIndex, generation);
    };

    u.onerror = (e) => {
        if (generation !== currentGeneration) return;
        if (e.error === "canceled" || e.error === "interrupted") return;
        clearHighlight();
        playBtn.innerHTML = playHTML;
    };

    speechSynthesis.speak(u);
}

function startSpeaking(from) {
    currentGeneration++;
    speechSynthesis.cancel();
    playBtn.innerHTML = stopHTML;
    const gen = currentGeneration;
    speakParagraph(from, gen);
}

function stopSpeaking() {
    currentGeneration++;
    speechSynthesis.cancel();
    playBtn.innerHTML = playHTML;
    clearHighlight();
}

globalThis.onTextReady = () => {
    paragraphIndex = 0;
    stopSpeaking();
    applyFont();
};
