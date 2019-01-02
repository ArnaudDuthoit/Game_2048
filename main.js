var score = 0;
var size = 4;

var cells = [];
var fontSize;

var canvas = document.getElementById('canvas');
var width = canvas.width / size - 6;

var ctx = canvas.getContext('2d');
var scoreLabel = document.getElementById('score');
var result = document.getElementById("score2"); // Result ID

var lose = false;

startGame();

scoreLabel.innerHTML = 'Score : ' + score;

// Victory/Win Screen

var modal = document.getElementById('simpleModal');  // Screen Victory ID

var closeBtn = document.getElementsByClassName('closeBtn')[0];

closeBtn.addEventListener('click', closeModal);

function openModal() {
    modal.style.display = 'block'; // Display the victory/win screen
    result.innerHTML = score;
}

function closeModal() {
    modal.style.display = 'none'; // Hide the victory/Win screen
    score = 0;
    size = 4;
    width = canvas.width / size - 6;
    cells = [];
    lose = false;
    startGame()

}

// Slide pour Mobile

canvas.addEventListener("touchstart", startTouch, false);
canvas.addEventListener("touchmove", moveTouch, false);

var initialX = null;
var initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // horizontal
        if (diffX > 0) {
            // gauche
            moveLeft();
        } else {
            // droite
            moveRight();
        }
    } else {
        // vertical
        if (diffY > 0) {
            // haut
            moveUp();
        } else {
            // bas
            moveDown();
        }

    }

    scoreLabel.innerHTML = 'Score : ' + score;

    initialX = null;
    initialY = null;

    e.preventDefault();
}



function cell(row, coll) {
    this.value = 0;
    this.x = coll * width + 5 * (coll + 1);
    this.y = row * width + 5 * (row + 1);
}

function createCells() {
    var i, j;
    for (i = 0; i < size; i++) {
        cells[i] = [];
        for (j = 0; j < size; j++) {
            cells[i][j] = new cell(i, j);
        }
    }
}

function drawCell(cell) {
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    switch (cell.value) {
        case 0 :
            ctx.fillStyle = '#A9A9A9';
            break;
        case 2 :
            ctx.fillStyle = '#D2691E';
            break;
        case 4 :
            ctx.fillStyle = '#FF7F50';
            break;
        case 8 :
            ctx.fillStyle = '#ffbf00';
            break;
        case 16 :
            ctx.fillStyle = '#bfff00';
            break;
        case 32 :
            ctx.fillStyle = '#40ff00';
            break;
        case 64 :
            ctx.fillStyle = '#00bfff';
            break;
        case 128 :
            ctx.fillStyle = '#FF7F50';
            break;
        case 256 :
            ctx.fillStyle = '#0040ff';
            break;
        case 512 :
            ctx.fillStyle = '#ff0080';
            break;
        case 1024 :
            ctx.fillStyle = '#D2691E';
            break;
        case 2048 :
            ctx.fillStyle = '#FF7F50';
            break;
        case 4096 :
            ctx.fillStyle = '#ffbf00';
            break;
        default :
            ctx.fillStyle = '#ff0080';
    }
    ctx.fill();
    if (cell.value) {
        fontSize = width / 2;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width / 7);

    }

}

document.onkeydown = function (event) {
    if (!lose) {
        if (event.keyCode === 38) {
            moveUp();
        } else if (event.keyCode === 39) {
            moveRight();
        } else if (event.keyCode === 40) {
            moveDown();
        } else if (event.keyCode === 37) {
            moveLeft();
        }
        scoreLabel.innerHTML = 'Score : ' + score;
    }
};

function startGame() {
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function finishGame() {
    openModal();
    score = 0;
    lose = true;
}

function drawAllCells() {
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            drawCell(cells[i][j]);
        }
    }
}

function pasteNewCell() {
    var countFree = 0;
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (!cells[i][j].value) {
                countFree++;
            }
        }
    }
    if (!countFree) {
        finishGame();
        return;
    }
    while (true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
        if (!cells[row][coll].value) {
            cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
            drawAllCells();
            return;
        }
    }
}

function moveRight() {
    var i, j;
    var coll;
    for (i = 0; i < size; i++) {
        for (j = size - 2; j >= 0; j--) {
            if (cells[i][j].value) {
                coll = j;
                while (coll + 1 < size) {
                    if (!cells[i][coll + 1].value) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
                    } else if (cells[i][coll].value == cells[i][coll + 1].value) {
                        cells[i][coll + 1].value *= 2;
                        score += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveLeft() {
    var i, j;
    var coll;
    for (i = 0; i < size; i++) {
        for (j = 1; j < size; j++) {
            if (cells[i][j].value) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (!cells[i][coll - 1].value) {
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
                    } else if (cells[i][coll].value == cells[i][coll - 1].value) {
                        cells[i][coll - 1].value *= 2;
                        score += cells[i][coll - 1].value;
                        cells[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveUp() {
    var i, j, row;
    for (j = 0; j < size; j++) {
        for (i = 1; i < size; i++) {
            if (cells[i][j].value) {
                row = i;
                while (row > 0) {
                    if (!cells[row - 1][j].value) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                    } else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        score += cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveDown() {
    var i, j, row;
    for (j = 0; j < size; j++) {
        for (i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                    } else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        score += cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}




