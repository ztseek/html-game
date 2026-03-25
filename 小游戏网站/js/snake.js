const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// 游戏主循环
function gameLoop() {
    changeSnakePosition(); // 1. 更新逻辑：移动蛇身
    if (isGameOver()) {  // 2. 碰撞检测
        alert('游戏结束！得分: ' + score);
        resetGame();  // ... 结束处理
        return;
    }
    
    clearCanvas();// 3. 渲染逻辑：清空画布
    drawFood(); // 3. 渲染逻辑：绘制食物
    drawSnake(); // 3. 渲染逻辑：绘制蛇
    drawScore();
}



function changeSnakePosition() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);// 增加新的蛇头
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;// 吃到食物，不pop，蛇身变长
        generateFood();
    } else {
        snake.pop(); // 未吃到食物，移除蛇尾，保持长度
    }
}

function clearCanvas() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#27ae60';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawScore() {
    scoreElement.textContent = score;
}

function isGameOver() {
    const head = snake[0];
    
    // 撞墙检测
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 撞到自己检测
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    generateFood();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    // 防止反向移动
    if (e.key === 'ArrowUp' && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (e.key === 'ArrowDown' && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (e.key === 'ArrowLeft' && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx !== -1) {
        dx = 1;
        dy = 0;
    }
});

// 初始化游戏
generateFood();
setInterval(gameLoop, 100);