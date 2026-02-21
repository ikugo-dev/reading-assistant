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

async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    currentText = "Loading...";
    navigateToReader();

    let text = "";

    if (file.type === "text/plain") {
        text = await readTextFile(file);
    } else if (file.type === "application/pdf") {
        text = await readPdfFile(file);
    }

    currentText = formatTextForDisplay(text);
    navigateToReader();
}

function handleTextSubmit() {
    const text = textInput.value.trim();

    if (!text) {
        alert("Please enter some text first.");
        return;
    }

    currentText = formatTextForDisplay(text);
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

    globalThis.scrollTo(0, 0);
}

function displayText() {
    textContent.innerHTML = currentText;
}
