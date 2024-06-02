const realFileBtn = document.getElementById("myFile");
const customBtn = document.getElementById("choose");
const customTxt = document.getElementById("choose_text");
const textarea = document.getElementById('text');
const lineNumbers = document.getElementById('lineNumbers');

document.getElementById("choose_text").onblur = function() { title(); };
customBtn.addEventListener("click", function() {
    realFileBtn.click();
});
realFileBtn.addEventListener("change", function() {
    if (realFileBtn.value) {
        customTxt.innerHTML = realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
        title();
    }
});
function title() {
    document.title = customTxt.innerHTML + " - " + "Text Editor";
}
function loadFileAsText() {
    var myFile = document.getElementById("myFile").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        textarea.value = textFromFileLoaded;
        updateLineNumbers();
    };
    fileReader.readAsText(myFile, "UTF-8");
}
function download(file, text) {
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8,'+ encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
document.getElementById("download").addEventListener("click", function() {
    var text = textarea.value;
    var filename = customTxt.innerHTML;
    download(filename, text);
    title();
}, false);
function copy() {
    let copyText = textarea;
    copyText.select();
    document.execCommand("copy");
    let copy = document.getElementById("myCopy");
    copy.innerHTML = "Copied!";
}
function uncopy() {
    let copy = document.getElementById("myCopy");
    copy.innerHTML = "";
}
textarea.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
});

function updateLineNumbers() {
    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array(lines).fill().map((_, i) => `<div>${i + 1}</div>`).join('');
    highlightCurrentLine();
}

let lastHighlightedLine = null;
function highlightCurrentLine() {
    const lineNumberDivs = lineNumbers.children;
    const textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
    const currentLineIndex = textLines.length - 1;

    // Remove the highlight from the previously highlighted line
    if (lastHighlightedLine !== null && lineNumberDivs[lastHighlightedLine]) {
        lineNumberDivs[lastHighlightedLine].classList.remove('highlighted');
    }

    // Add the highlight to the current line if the textarea is focused
    if (textarea === document.activeElement && lineNumberDivs[currentLineIndex]) {
        lineNumberDivs[currentLineIndex].classList.add('highlighted');
        lastHighlightedLine = currentLineIndex;
    } else {
        lastHighlightedLine = null;
    }
}

textarea.addEventListener('input', () => {
    updateLineNumbers();
    highlightCurrentLine();
});
textarea.addEventListener('click', highlightCurrentLine);
textarea.addEventListener('keyup', highlightCurrentLine);
textarea.addEventListener('scroll', highlightCurrentLine);
textarea.addEventListener('mousemove', highlightCurrentLine);
textarea.addEventListener('focus', highlightCurrentLine);
textarea.addEventListener('blur', function() {
    if (lastHighlightedLine !== null) {
        const lineNumberDivs = lineNumbers.children;
        if (lineNumberDivs[lastHighlightedLine]) {
            lineNumberDivs[lastHighlightedLine].classList.remove('highlighted');
        }
        lastHighlightedLine = null;
    }
});

function syncScroll() {
    lineNumbers.scrollTop = textarea.scrollTop;
}

window.onload = function() {
    updateLineNumbers();
};