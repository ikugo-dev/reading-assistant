const homePage = document.getElementById("homePage");
const readerPage = document.getElementById("readerPage");

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const textInput = document.getElementById("textInput");
const submitBtn = document.getElementById("submitBtn");

const textContent = document.getElementById("textContent");
const backBtn = document.getElementById("backBtn");

fileInput.addEventListener("change", (e) => handleFileSelect(e));
submitBtn.addEventListener("click", () => handleTextSubmit());
backBtn.addEventListener("click", () => navigateToHome());

let currentText = "";

globalThis.getCurrentText = () => currentText;

function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    fileName.textContent = file.name;

    if (file.type === "text/plain") {
        const reader = new FileReader();

        reader.onload = () => {
            currentText = reader.result;
            navigateToReader();
        };

        reader.onerror = () => {
            alert("Error reading file.");
        };

        reader.readAsText(file);
        return;
    }

    if (file.type === "application/pdf") {
        alert("PDF reading not implemented yet.");
    }
}

function handleTextSubmit() {
    const text = textInput.value.trim();

    if (!text) {
        alert("Please enter some text first.");
        return;
    }

    currentText = text;
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
    fileName.textContent = "Choose a .txt or .pdf file";

    globalThis.scrollTo(0, 0);
}

function displayText() {
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
    const paragraphs = currentText
        .split("\n\n")
        .filter((p) => p.trim())
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");

    textContent.innerHTML = paragraphs || `<p>${escapeHtml(currentText)}</p>`;
}
