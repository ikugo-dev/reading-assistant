let availableVoices = [];

function loadVoices() {
    availableVoices = speechSynthesis.getVoices() || [];
}
loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function pickBestVoiceForLang(lang) {
    const voices = availableVoices.length
        ? availableVoices
        : speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    const normLang = (lang || "").toLowerCase();

    const matches = (v) =>
        (v.lang || "").toLowerCase() === normLang ||
        (v.lang || "").toLowerCase().startsWith(normLang);

    const qualityScore = (v) => {
        const name = (v.name || "").toLowerCase();
        let score = 0;
        if (
            name.includes("neural") || name.includes("natural") ||
            name.includes("premium")
        ) score += 100;
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
