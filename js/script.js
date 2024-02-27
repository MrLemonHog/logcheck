const wordsToSearch = ['baritone', 'boatfly', 'xray', 'freecam', 'minimap', 'auto attack', 'neat', 'swapper'];

const chooseFileButton = document.getElementById('chooseFile');
const fileInput = document.getElementById('fileInput');
const sirenSounds = [
        document.getElementById('sirenSound1'),
        document.getElementById('sirenSound2'),
        document.getElementById('sirenSound3')
    ];
    const noMatchSounds = [
        document.getElementById('noMatchSound1'),
        document.getElementById('noMatchSound2'),
        document.getElementById('noMatchSound3')
    ];

chooseFileButton.addEventListener('click', function () {
    fileInput.click();
});

fileInput.addEventListener('change', function (event) {
    processFiles(event.target.files);
});

window.addEventListener('dragover', function (event) {
    event.preventDefault();
    document.body.classList.add('dragover');
});

window.addEventListener('dragleave', function (event) {
    document.body.classList.remove('dragover');
});

window.addEventListener('drop', function (event) {
    event.preventDefault();
    document.body.classList.remove('dragover');
    processFiles(event.dataTransfer.files);
});

function processFiles(files) {
let allFoundWords = {};
const fileCountDiv = document.getElementById('fileCount');
fileCountDiv.textContent = files.length > 1 ? `Загружено файлов: ${files.length}` : '';

Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = function () {
        let content;
        if (file.name.endsWith('.gz')) {
            const byteCharacters = atob(reader.result.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const decompressed = pako.inflate(byteArray, { to: 'string' });
            content = decompressed;
        } else {
            content = reader.result;
        }

        const lines = content.split('\n');
        let foundWords = {};

        wordsToSearch.forEach(word => {
            foundWords[word] = false;
        });

        lines.forEach(line => {
            const lowercaseLine = line.toLowerCase();
            wordsToSearch.forEach(word => {
                if (lowercaseLine.includes(word.toLowerCase())) {
                    foundWords[word] = { found: true, line: line };
                }
            });
        });

        Object.keys(foundWords).forEach(word => {
            if (!(word in allFoundWords)) {
                allFoundWords[word] = [];
            }
            if (foundWords[word].found) {
                allFoundWords[word].push({ found: true, line: foundWords[word].line });
            }
        });

        displayResults(allFoundWords, files.length);
    };

    if (file.name.endsWith('.gz')) {
        reader.readAsDataURL(file);
    } else {
        reader.readAsText(file);
    }
});
}

function displayResults(allFoundWords, fileCount) {
const outputDiv = document.getElementById('output');
outputDiv.innerHTML = '';

let matchFound = false;

Object.keys(allFoundWords).forEach(word => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    const circleSpan = document.createElement('span');
    circleSpan.textContent = '●';
    circleSpan.style.marginRight = '5px';
    resultDiv.appendChild(circleSpan);
    const wordSpan = document.createElement('span');
    wordSpan.textContent = `${word} (${allFoundWords[word].length})`; // добавляем количество найденных слов
    wordSpan.classList.add('word');
    resultDiv.appendChild(wordSpan);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть блоки';
    closeButton.style.float = 'right';
    let isOpen = true; // добавляем переменную для отслеживания состояния
    closeButton.addEventListener('click', function() {
        const lineBlocks = resultDiv.querySelectorAll('.line');
        lineBlocks.forEach(function(block) {
            if (isOpen) {
                block.style.display = 'none'; // закрываем блоки
            } else {
                block.style.display = 'block'; // открываем блоки
            }
        });
        isOpen = !isOpen; // меняем состояние
        closeButton.textContent = isOpen ? 'Закрыть блоки' : 'Открыть блоки'; // меняем текст кнопки
    });
    resultDiv.appendChild(closeButton);

    allFoundWords[word].forEach(foundWord => {
        if (foundWord.found) {
            circleSpan.classList.add('found');
            resultDiv.classList.add('found');
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.style.display = 'block'; // изначально отображаем блоки
            lineDiv.innerHTML = foundWord.line.replace(new RegExp(word, 'gi'), function (matched) {
                return '<span class="highlight">' + matched + '</span>';
            });
            resultDiv.appendChild(lineDiv);
            matchFound = true;
        }
    });

    outputDiv.appendChild(resultDiv);
});

if (matchFound) {
        const soundIndex = Math.floor(Math.random() * sirenSounds.length);
        sirenSounds[soundIndex].play();
    } else {
        const soundIndex = Math.floor(Math.random() * noMatchSounds.length);
        noMatchSounds[soundIndex].play();
    }

outputDiv.style.display = 'block';
}


const typewriterText = document.querySelector(".typewriter");
const phrases = [
    "Привет 👋",
    "Попався?",
    "Xray?",
    "Прошарок кровосісів",
    "Иди уроки учи",
    "Разбан за 478.00 ₽",
    "Купи новый пк",
    "Посади дерево",
    "Где демка?",
    "Герои3 лучшая игра",
];

let phraseIndex = 0;
let characterIndex = 0;

function type() {
    if (characterIndex < phrases[phraseIndex].length) {
        typewriterText.textContent += phrases[phraseIndex][characterIndex];
        characterIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 1000);
    }
}

function erase() {
    if (characterIndex > 0) {
        typewriterText.textContent = phrases[phraseIndex].substring(0, characterIndex - 1);
        characterIndex--;
        setTimeout(erase, 50);
    } else {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 250);
    }
}

type();