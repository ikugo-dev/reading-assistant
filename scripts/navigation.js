const homePage = document.getElementById("homePage");
const readerPage = document.getElementById("readerPage");

const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const submitBtn = document.getElementById("submitBtn");

const textContent = document.getElementById("textContent");
const backBtn = document.getElementById("backBtn");

fileInput.addEventListener("change", (e) => handleFileSelect(e));
submitBtn.addEventListener("click", () => handleTextSubmit());
backBtn.addEventListener("click", () => navigateToHome());

let currentText = "";
let paragraphs = [];

function updateCurrentText() {
    currentText = paragraphs
        .map((p, i) => `<p id="paragraph${i}">${p.trim()}</p>`)
        .join("");
}

async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    currentText = "Loading...";
    navigateToReader();

    if (file.type === "text/plain") {
        paragraphs = await formatTextToParagraphs(await readTextFile(file));
    } else if (file.type === "application/pdf") {
        paragraphs = await formatPdfToParagraphs(await readPdfFile(file));
    }

    updateCurrentText();
    navigateToReader();
}

function handleTextSubmit() {
    const text = textInput.value.trim();

    if (!text) {
        alert("Please enter some text first.");
        return;
    }
    paragraphs = formatTextToParagraphs(text);

    updateCurrentText();
    navigateToReader();
}

function navigateToReader() {
    homePage.classList.remove("active");
    readerPage.classList.add("active");

    globalThis.onTextReady?.(currentText);

    displayText();

    globalThis.scrollTo(0, 0);
}

function navigateToHome() {
    readerPage.classList.remove("active");
    homePage.classList.add("active");

    textInput.value = "";
    fileInput.value = "";

    globalThis.scrollTo(0, 0);
}

function displayText() {
    textContent.innerHTML = currentText;
}
