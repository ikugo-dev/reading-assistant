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

    currentText = text;
    navigateToReader();
}

function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function readPdfFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;

                let fullText = "";

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();

                    fullText += textContent.items
                        .map((item) => item.str)
                        .join(" ") + "\n";
                }

                resolve(fullText);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
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
