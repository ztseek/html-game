let puzzleSize = 4; // 默认4x4
let tiles = [];
let emptyIndex = 0;
let moveCount = 0;
let startTime = 0;
let timerInterval = null;
let isGameStarted = false;

const puzzleBoard = document.getElementById('puzzleBoard');
const moveCountElement = document.getElementById('moveCount');
const timeDisplay = document.getElementById('timeDisplay');
const winMessage = document.getElementById('winMessage');

// 初始化游戏
function initGame() {
    puzzleBoard.innerHTML = '';
    puzzleBoard.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
    
    // 创建数字数组 [1, 2, 3, ..., n-1]
    const totalTiles = puzzleSize * puzzleSize;
    tiles = Array.from({length: totalTiles - 1}, (_, i) => i + 1);
    tiles.push(0); // 0 表示空位
    emptyIndex = totalTiles - 1;
    
    // 随机打乱
    shuffleTiles();
    
    // 创建拼图块
    createTiles();
    
    // 重置计数器和计时器
    moveCount = 0;
    moveCountElement.textContent = moveCount;
    resetTimer();
    
    winMessage.style.display = 'none';
    isGameStarted = false;
}

// 创建拼图块
function createTiles() {
    tiles.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.className = value === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
        tile.textContent = value === 0 ? '' : value;
        tile.dataset.index = index;
        tile.dataset.value = value;
        
        if (value !== 0) {
            tile.addEventListener('click', () => moveTile(index));
        }
        
        puzzleBoard.appendChild(tile);
    });
}

// 洗牌算法
function shuffleTiles() {
    // 为了确保拼图有解，我们模拟随机移动
    const directions = [-1, 1, -puzzleSize, puzzleSize]; // 左、右、上、下
    const shuffleMoves = 1000; // 随机移动次数
    
    for (let i = 0; i < shuffleMoves; i++) {
        const validMoves = directions.filter(dir => {
            const newIndex = emptyIndex + dir;
            return isValidMove(newIndex);
        });
        
        if (validMoves.length > 0) {
            const randomDir = validMoves[Math.floor(Math.random() * validMoves.length)];
            const tileIndex = emptyIndex + randomDir;
            
            // 交换位置
            [tiles[emptyIndex], tiles[tileIndex]] = [tiles[tileIndex], tiles[emptyIndex]];
            emptyIndex = tileIndex;
        }
    }
}

// 移动拼图块
function moveTile(clickedIndex) {
    if (!isGameStarted) {
        startTimer();
        isGameStarted = true;
    }
    
    // 检查是否与空位相邻
    const rowDiff = Math.floor(clickedIndex / puzzleSize) - Math.floor(emptyIndex / puzzleSize);
    const colDiff = (clickedIndex % puzzleSize) - (emptyIndex % puzzleSize);
    
    const isAdjacent = (Math.abs(rowDiff) === 1 && colDiff === 0) || 
                      (Math.abs(colDiff) === 1 && rowDiff === 0);
    
    if (isAdjacent) {
        // 交换位置
        [tiles[emptyIndex], tiles[clickedIndex]] = [tiles[clickedIndex], tiles[emptyIndex]];
        
        // 更新空位索引
        emptyIndex = clickedIndex;
        
        // 更新显示
        updateDisplay();
        
        // 增加步数
        moveCount++;
        moveCountElement.textContent = moveCount;
        
        // 检查是否完成
        if (checkWin()) {
            winGame();
        }
    }
}

// 更新显示
function updateDisplay() {
    const tileElements = puzzleBoard.querySelectorAll('.puzzle-tile');
    
    tileElements.forEach((tile, index) => {
        const value = tiles[index];
        tile.textContent = value === 0 ? '' : value;
        tile.dataset.value = value;
        tile.dataset.index = index;
        
        // 更新点击事件
        tile.onclick = null;
        if (value !== 0) {
            tile.onclick = () => moveTile(index);
        }
        
        // 更新类名
        tile.className = value === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
    });
}

// 检查移动是否有效
function isValidMove(index) {
    if (index < 0 || index >= puzzleSize * puzzleSize) return false;
    
    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    const tileRow = Math.floor(index / puzzleSize);
    const tileCol = index % puzzleSize;
    
    return (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
           (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow);
}

// 检查是否获胜
function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) {
            return false;
        }
    }
    return tiles[tiles.length - 1] === 0; // 最后一个应该是空位
}

// 获胜处理
function winGame() {
    clearInterval(timerInterval);
    
    document.getElementById('finalMoves').textContent = moveCount;
    document.getElementById('finalTime').textContent = timeDisplay.textContent;
    winMessage.style.display = 'block';
}

// 计时器功能
function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeDisplay.textContent = '00:00';
}

// 设置难度
function setDifficulty(size) {
    puzzleSize = size;
    
    // 更新按钮状态
    document.getElementById('btn3x3').classList.remove('active');
    document.getElementById('btn4x4').classList.remove('active');
    document.getElementById('btn5x5').classList.remove('active');
    document.getElementById(`btn${size}x${size}`).classList.add('active');
    
    initGame();
}

// 重新开始游戏
function resetGame() {
    initGame();
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);