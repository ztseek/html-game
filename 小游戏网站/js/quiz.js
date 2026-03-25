// 题库数据
const questionBank = {
    'all': [
        {
            question: "HTML是什么的缩写？",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            correct: 0,
            category: "science",
            explanation: "HTML是Hyper Text Markup Language（超文本标记语言）的缩写。"
        },
        {
            question: "以下哪个不是JavaScript框架？",
            options: ["React", "Vue", "Angular", "Java"],
            correct: 3,
            category: "science",
            explanation: "Java是一种编程语言，不是JavaScript框架。"
        },
        {
            question: "中国的首都是哪个城市？",
            options: ["上海", "广州", "北京", "深圳"],
            correct: 2,
            category: "history",
            explanation: "北京是中国的首都。"
        },
        {
            question: "万里长城最初是为了什么目的建造的？",
            options: ["旅游观光", "防御外敌", "宗教仪式", "水利工程"],
            correct: 1,
            category: "history",
            explanation: "万里长城最初是为了防御北方游牧民族的入侵而建造的。"
        },
        {
            question: "2022年世界杯在哪个国家举办？",
            options: ["巴西", "俄罗斯", "卡塔尔", "法国"],
            correct: 2,
            category: "sports",
            explanation: "2022年世界杯在卡塔尔举办。"
        },
        {
            question: "篮球比赛中，一个三分球得几分？",
            options: ["1分", "2分", "3分", "4分"],
            correct: 2,
            category: "sports",
            explanation: "在篮球比赛中，三分球得3分。"
        },
        {
            question: "以下哪个不是操作系统？",
            options: ["Windows", "Linux", "Photoshop", "macOS"],
            correct: 2,
            category: "science",
            explanation: "Photoshop是图像处理软件，不是操作系统。"
        },
        {
            question: "《红楼梦》的作者是谁？",
            options: ["施耐庵", "曹雪芹", "罗贯中", "吴承恩"],
            correct: 1,
            category: "history",
            explanation: "《红楼梦》的作者是曹雪芹。"
        },
        {
            question: "奥运会每几年举办一次？",
            options: ["2年", "3年", "4年", "5年"],
            correct: 2,
            category: "sports",
            explanation: "夏季奥运会和冬季奥运会都是每4年举办一次。"
        },
        {
            question: "以下哪个是Python的web框架？",
            options: ["Django", "Spring", "Ruby on Rails", "Laravel"],
            correct: 0,
            category: "science",
            explanation: "Django是Python的web框架，其他分别是Java、Ruby和PHP的框架。"
        }
    ],
    'science': [
        // 专门的科学类问题
    ],
    'history': [
        // 专门的历史类问题  
    ],
    'sports': [
        // 专门的体育类问题
    ]
};

// 初始化题库（简化处理，实际中可以分别定义）
questionBank.science = questionBank.all.filter(q => q.category === 'science');
questionBank.history = questionBank.all.filter(q => q.category === 'history');
questionBank.sports = questionBank.all.filter(q => q.category === 'sports');

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = 'all';
let userAnswers = [];

// DOM元素
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextBtn = document.getElementById('nextBtn');
const currentQuestionElement = document.getElementById('currentQuestion');
const totalQuestionsElement = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');
const currentScoreElement = document.getElementById('currentScore');
const feedback = document.getElementById('feedback');
const finalScoreCircle = document.getElementById('finalScoreCircle');
const resultMessage = document.getElementById('resultMessage');
const correctAnswersElement = document.getElementById('correctAnswers');
const totalAnsweredElement = document.getElementById('totalAnswered');

// 设置类别
function setCategory(category) {
    selectedCategory = category;
    
    // 更新按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 开始测验
function startQuiz() {
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    
    // 根据类别选择问题
    currentQuestions = [...questionBank[selectedCategory]];
    
    // 如果选择"所有类别"，就从所有问题中随机选择
    if (selectedCategory === 'all') {
        // 随机选择10个问题
        const shuffled = [...questionBank.all].sort(() => 0.5 - Math.random());
        currentQuestions = shuffled.slice(0, 10);
    }
    
    // 重置状态
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // 更新UI
    totalQuestionsElement.textContent = currentQuestions.length;
    currentScoreElement.textContent = score;
    
    // 显示第一个问题
    showQuestion();
}

// 显示问题
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // 更新进度
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    progressFill.style.width = `${((currentQuestionIndex) / currentQuestions.length) * 100}%`;
    
    // 显示问题
    questionText.textContent = question.question;
    
    // 显示选项
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // 重置按钮和反馈
    nextBtn.disabled = true;
    feedback.style.display = 'none';
    feedback.className = 'feedback';
}

// 选择选项
function selectOption(selectedIndex) {
    // 防止重复选择
    if (nextBtn.disabled === false) return;
    
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // 标记选中的选项
    options.forEach(option => {
        option.classList.remove('selected');
    });
    options[selectedIndex].classList.add('selected');
    
    // 检查答案
    const isCorrect = selectedIndex === question.correct;
    
    // 显示正确答案和反馈
    options[question.correct].classList.add('correct');
    if (!isCorrect) {
        options[selectedIndex].classList.add('incorrect');
    }
    
    // 显示反馈信息
    feedback.textContent = isCorrect ? '✅ 回答正确!' : `❌ 回答错误! ${question.explanation}`;
    feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
    feedback.style.display = 'block';
    
    // 记录用户答案
    userAnswers.push({
        question: question.question,
        userAnswer: selectedIndex,
        correctAnswer: question.correct,
        isCorrect: isCorrect,
        explanation: question.explanation
    });
    
    // 更新分数
    if (isCorrect) {
        score++;
        currentScoreElement.textContent = score;
    }
    
    // 启用下一题按钮
    nextBtn.disabled = false;
}

// 下一题
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// 显示结果
function showResults() {
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    // 更新结果界面
    finalScoreCircle.textContent = `${percentage}%`;
    correctAnswersElement.textContent = score;
    totalAnsweredElement.textContent = currentQuestions.length;
    
    // 根据分数显示不同消息
    if (percentage >= 90) {
        resultMessage.textContent = '太棒了！你是知识达人！';
        finalScoreCircle.style.background = '#27ae60';
    } else if (percentage >= 70) {
        resultMessage.textContent = '做得不错！继续努力！';
        finalScoreCircle.style.background = '#3498db';
    } else if (percentage >= 50) {
        resultMessage.textContent = '还可以，再接再厉！';
        finalScoreCircle.style.background = '#f39c12';
    } else {
        resultMessage.textContent = '需要多学习哦！';
        finalScoreCircle.style.background = '#e74c3c';
    }
}

// 重新开始
function restartQuiz() {
    resultScreen.style.display = 'none';
    startQuiz();
}

// 开始新游戏（回到开始界面）
function startNewGame() {
    resultScreen.style.display = 'none';
    quizScreen.style.display = 'none';
    startScreen.style.display = 'block';
}

// 查看答案
function showAnswers() {
    let answersText = "答题回顾:\n\n";
    
    userAnswers.forEach((answer, index) => {
        answersText += `问题 ${index + 1}: ${answer.question}\n`;
        answersText += `你的答案: ${currentQuestions[index].options[answer.userAnswer]}\n`;
        answersText += `正确答案: ${currentQuestions[index].options[answer.correctAnswer]}\n`;
        answersText += `解释: ${answer.explanation}\n\n`;
    });
    
    alert(answersText);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加初始化代码
});