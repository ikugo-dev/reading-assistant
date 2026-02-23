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
                    const lines = {};
                    textContent.items.forEach((item) => {
                        const y = Math.round(item.transform[5]);
                        if (!lines[y]) lines[y] = [];
                        lines[y].push(item.str);
                    });
                    fullText += Object.keys(lines)
                        .sort((a, b) => b - a)
                        .map((y) => lines[y].join(" "))
                        .join("\n");
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

function formatTextToParagraphs(text) {
    if (!text) return "";

    text = text.replace(/\r\n/g, "\n")
        .replace(/\n/g, "\n\n");

    const paragraphs = text
        .split(/\n\n/)
        .filter((p) => p);

    return paragraphs;
}

function formatPdfToParagraphs(text) {
    if (!text) return "";

    text = text.replace(/\r\n/g, "\n")
        .replace(/\n\s+(?=[A-Z])/g, "<<<PARA>>>")
        .replace(/\n/g, " ")
        .replace(/<<<PARA>>>/g, "\n\n");

    const paragraphs = text
        .split(/\n\n/)
        .filter((p) => p);

    return paragraphs;
}

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
