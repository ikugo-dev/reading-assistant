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

function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    fileName.textContent = file.name;

    let text = "";

    if (file.type === "text/plain") {
        text = fetch("myText.txt")
            .then((res) => res.text())
            .catch((e) => alert("Error reading file. Please try again." + e));
    } else if (file.type === "application/pdf") {
        // TODO add pdf reading
    }

    currentText = text;
    navigateToReader();
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
