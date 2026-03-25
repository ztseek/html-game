const memoryBoard = document.getElementById('memory-board');
const movesElement = document.getElementById('moves');

const cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let gameCards = [...cards, ...cards]; // 复制一份用于配对
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;

// 洗牌算法
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 初始化游戏
function initGame() {
    memoryBoard.innerHTML = '';
    flippedCards = [];
    moves = 0;
    matchedPairs = 0;
    movesElement.textContent = moves;
    
    const shuffledCards = shuffle([...gameCards]);
    
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.dataset.value = card;
        
        cardElement.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${card}</div>
        `;
        
        cardElement.addEventListener('click', flipCard);
        memoryBoard.appendChild(cardElement);
    });
}

// 翻转卡片
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            checkForMatch();
        }
    }
}

// 检查是否匹配
function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.value === card2.dataset.value) {
        // 匹配成功
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === cards.length) {
            setTimeout(() => {
                alert(`恭喜！游戏完成！步数: ${moves}`);
            }, 500);
        }
        
        flippedCards = [];
    } else {
        // 不匹配，翻回去
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    initGame();
}

// 初始化游戏
initGame();