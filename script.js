// 全局变量
let currentText = '';
let startTime;
let timer;
let errors = 0;
let totalTyped = 0;
let isActive = false;

// 键盘布局
const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
];

// 示例文本
const texts = {
    words: [
        "the quick brown fox jumps over the lazy dog",
        "hello world programming computer keyboard typing",
        "practice makes perfect keep trying never give up",
        "keyboard shortcut efficiency productivity workflow"
    ],
    sentences: [
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump! Amazingly few discotheques provide jukeboxes.",
        "Sphinx of black quartz, judge my vow. Jackdaws love my big sphinx of quartz.",
        "The five boxing wizards jump quickly. Crazy Fredrick bought many very exquisite opal jewels."
    ],
    paragraphs: [
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Amazingly few discotheques provide jukeboxes. Sphinx of black quartz, judge my vow. Jackdaws love my big sphinx of quartz. The five boxing wizards jump quickly.",
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++. Created in 1995 by Brendan Eich, JavaScript is one of the most popular and dynamic languages used in web development today.",
        "Typing is the process of writing or inputting text by pressing keys on a typewriter, computer keyboard, cell phone, or calculator. It can be distinguished from other means of text input, such as handwriting and speech recognition. Text can be in the form of letters, numbers and other symbols."
    ],
    articles: [
        "The art of typing efficiently is a valuable skill in today's digital world. Learning to type without looking at the keyboard, commonly known as touch typing, can significantly increase your productivity. Regular practice is key to improving your typing speed and accuracy. Start with the home row keys (ASDF for the left hand and JKL; for the right hand) and gradually expand to other keys. Focus on accuracy first, then speed will naturally follow as you become more comfortable with the keyboard layout. Many online typing tutors offer structured lessons and exercises to help you track your progress. Remember, consistency is more important than intensity when developing muscle memory for typing.",
        "Computer programming is the process of performing a particular computation, usually by designing and building an executable computer program. Programming involves tasks such as analysis, generating algorithms, profiling algorithms' accuracy and resource consumption, and the implementation of algorithms. The source code of a program is written in one or more languages that are intelligible to programmers, rather than machine code, which is directly executed by the central processing unit. The purpose of programming is to find a sequence of instructions that will automate the performance of a task on a computer, often for solving a given problem. Proficient programming thus usually requires expertise in several different subjects, including knowledge of the application domain, specialized algorithms, and formal logic."
    ]
};

// DOM 元素
const difficultySelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('theme');
const fingerGuideSelect = document.getElementById('finger-guide');
const startButton = document.getElementById('start-btn');
const textDisplay = document.getElementById('text-display');
const errorCount = document.getElementById('error-count');
const wpmDisplay = document.getElementById('wpm');
const cpmDisplay = document.getElementById('cpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const virtualKeyboard = document.getElementById('virtual-keyboard');
const progressBar = document.getElementById('progress-bar');

// 手指映射（键盘按键对应的手指）
const fingerMap = {
    // 左手小指
    '`': 'finger-left-pinky', '1': 'finger-left-pinky', 'tab': 'finger-left-pinky', 
    'q': 'finger-left-pinky', 'a': 'finger-left-pinky', 'z': 'finger-left-pinky', 
    'caps': 'finger-left-pinky', 'shift': 'finger-left-pinky',
    
    // 左手无名指
    '2': 'finger-left-ring', 'w': 'finger-left-ring', 's': 'finger-left-ring', 'x': 'finger-left-ring',
    
    // 左手中指
    '3': 'finger-left-middle', 'e': 'finger-left-middle', 'd': 'finger-left-middle', 'c': 'finger-left-middle',
    
    // 左手食指
    '4': 'finger-left-index', '5': 'finger-left-index', 'r': 'finger-left-index', 
    't': 'finger-left-index', 'f': 'finger-left-index', 'g': 'finger-left-index', 
    'v': 'finger-left-index', 'b': 'finger-left-index',
    
    // 右手食指
    '6': 'finger-right-index', '7': 'finger-right-index', 'y': 'finger-right-index', 
    'u': 'finger-right-index', 'h': 'finger-right-index', 'j': 'finger-right-index', 
    'n': 'finger-right-index', 'm': 'finger-right-index',
    
    // 右手中指
    '8': 'finger-right-middle', 'i': 'finger-right-middle', 'k': 'finger-right-middle', ',': 'finger-right-middle',
    
    // 右手无名指
    '9': 'finger-right-ring', 'o': 'finger-right-ring', 'l': 'finger-right-ring', '.': 'finger-right-ring',
    
    // 右手小指
    '0': 'finger-right-pinky', '-': 'finger-right-pinky', '=': 'finger-right-pinky', 
    'backspace': 'finger-right-pinky', '\\': 'finger-right-pinky', ']': 'finger-right-pinky', 
    '[': 'finger-right-pinky', 'p': 'finger-right-pinky', ';': 'finger-right-pinky', 
    '\'': 'finger-right-pinky', '/': 'finger-right-pinky', 'enter': 'finger-right-pinky',
    
    // 空格键（拇指）
    ' ': 'finger-thumb'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    createVirtualKeyboard();
    startButton.addEventListener('click', startTyping);
    document.addEventListener('keydown', highlightKey);
    document.addEventListener('keyup', removeHighlight);
    
    // 主题切换
    themeSelect.addEventListener('change', changeTheme);
    
    // 手指指引切换
    fingerGuideSelect.addEventListener('change', toggleFingerGuide);
    
    // 初始化主题和手指指引
    changeTheme();
    toggleFingerGuide();
});

// 切换主题
function changeTheme() {
    const theme = themeSelect.value;
    document.body.className = theme !== 'default' ? theme : '';
    
    // 重新应用手指指引，确保主题切换后不会丢失
    setTimeout(() => {
        toggleFingerGuide();
    }, 50); // 添加短暂延迟，确保主题样式应用后再应用手指指引
}

// 切换手指指引
function toggleFingerGuide() {
    const showFingerGuide = fingerGuideSelect.value === 'on';
    
    // 移除所有手指指引类
    document.querySelectorAll('.key').forEach(key => {
        Object.values(fingerMap).forEach(fingerClass => {
            key.classList.remove(fingerClass);
        });
    });
    
    // 如果启用手指指引，添加对应类
    if (showFingerGuide) {
        document.querySelectorAll('.key').forEach(key => {
            const keyValue = key.dataset.key;
            if (keyValue && fingerMap[keyValue]) {
                key.classList.add(fingerMap[keyValue]);
            }
        });
    }
    
    // 图例显隐与指引同步
    const legendEl = document.getElementById('finger-legend');
    if (legendEl) {
        legendEl.style.display = showFingerGuide ? '' : 'none';
    }
}

// 创建虚拟键盘
function createVirtualKeyboard() {
    virtualKeyboard.innerHTML = '';
    
    keyboardLayout.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.dataset.key = key.toLowerCase();
            keyElement.textContent = key;
            
            // 特殊键样式
            if (key === 'Space') {
                keyElement.classList.add('space');
                keyElement.dataset.key = ' ';
            } else if (['Backspace', 'Tab', 'Caps', 'Enter', 'Shift', 'Ctrl', 'Win', 'Alt', 'Menu'].includes(key)) {
                keyElement.classList.add('wide');
            }
            
            keyboardRow.appendChild(keyElement);
        });
        
        virtualKeyboard.appendChild(keyboardRow);
    });
}

// 存储按键动画的定时器
const keyAnimationTimers = {};

// 高亮按键
function highlightKey(e) {
    const key = e.key.toLowerCase();
    let keyElements = [];
    
    // 获取对应的键盘元素
    if (key === ' ') {
        const spaceKey = document.querySelector('.key[data-key=" "]');
        if (spaceKey) keyElements.push(spaceKey);
    } else if (key === 'shift') {
        const shiftKeys = document.querySelectorAll('.key[data-key="shift"]');
        shiftKeys.forEach(k => keyElements.push(k));
    } else if (key === 'control') {
        const ctrlKeys = document.querySelectorAll('.key[data-key="ctrl"]');
        ctrlKeys.forEach(k => keyElements.push(k));
    } else if (key === 'alt') {
        const altKeys = document.querySelectorAll('.key[data-key="alt"]');
        altKeys.forEach(k => keyElements.push(k));
    } else {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) keyElements.push(keyElement);
    }
    
    // 应用高亮效果
    keyElements.forEach(keyElement => {
        // 清除之前的定时器
        if (keyAnimationTimers[keyElement.dataset.key]) {
            clearTimeout(keyAnimationTimers[keyElement.dataset.key]);
            keyElement.style.transition = '';
        }
        
        // 添加高亮效果
        keyElement.classList.add('active');
        keyElement.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.8)';
    });
}

// 移除高亮
function removeHighlight(e) {
    const key = e.key.toLowerCase();
    let keyElements = [];
    
    // 获取对应的键盘元素
    if (key === ' ') {
        const spaceKey = document.querySelector('.key[data-key=" "]');
        if (spaceKey) keyElements.push(spaceKey);
    } else if (key === 'shift') {
        const shiftKeys = document.querySelectorAll('.key[data-key="shift"]');
        shiftKeys.forEach(k => keyElements.push(k));
    } else if (key === 'control') {
        const ctrlKeys = document.querySelectorAll('.key[data-key="ctrl"]');
        ctrlKeys.forEach(k => keyElements.push(k));
    } else if (key === 'alt') {
        const altKeys = document.querySelectorAll('.key[data-key="alt"]');
        altKeys.forEach(k => keyElements.push(k));
    } else {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) keyElements.push(keyElement);
    }
    
    // 应用渐变效果
    keyElements.forEach(keyElement => {
        // 设置渐变效果
        keyElement.style.transition = 'all 2s ease';
        
        // 创建定时器，2秒后移除高亮
        keyAnimationTimers[keyElement.dataset.key] = setTimeout(() => {
            keyElement.classList.remove('active');
            keyElement.style.boxShadow = '';
            keyElement.style.transition = '';
            delete keyAnimationTimers[keyElement.dataset.key];
        }, 2000);
    });
}

// 重置所有键盘高亮
function resetKeyboardHighlights() {
    // 清除所有定时器
    Object.keys(keyAnimationTimers).forEach(key => {
        clearTimeout(keyAnimationTimers[key]);
        delete keyAnimationTimers[key];
    });
    
    // 移除所有高亮效果
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('active');
        key.style.boxShadow = '';
        key.style.transition = '';
    });
}

// 开始打字练习
function startTyping() {
    if (isActive) {
        clearInterval(timer);
        // 移除之前的键盘监听
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    isActive = true;
    errors = 0;
    totalTyped = 0;
    startTime = null; // 初始化为null，等第一次按键时才开始计时
    
    // 重置统计
    errorCount.textContent = '0';
    wpmDisplay.textContent = '0';
    cpmDisplay.textContent = '0'; // 添加CPM显示
    accuracyDisplay.textContent = '100%';
    timeDisplay.textContent = '0s';
    
    // 重置进度条
    resetProgressBar();
    
    // 获取难度和文本
    const difficulty = difficultySelect.value;
    const textArray = texts[difficulty];
    
    // 记录上一次的文本，确保不重复
    const lastText = currentText;
    let newText;
    
    // 确保新选择的文本与上一次不同
    do {
        newText = textArray[Math.floor(Math.random() * textArray.length)];
    } while (newText === lastText && textArray.length > 1);
    
    currentText = newText;
    
    // 显示文本
    displayText();
    
    // 启用键盘监听
    document.addEventListener('keydown', handleKeyPress);
    
    // 更改按钮文本
    startButton.textContent = '重新开始';
}

// 显示文本
function displayText(typedLength = 0) {
    textDisplay.innerHTML = '';
    
    for (let i = 0; i < currentText.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = currentText[i];
        
        if (i < typedLength) {
            charSpan.classList.add('correct');
        } else if (i === typedLength) {
            charSpan.classList.add('current');
        }
        
        textDisplay.appendChild(charSpan);
    }
    
    // 确保当前字符可见（自动滚动）
    const currentChar = textDisplay.querySelector('.current');
    if (currentChar) {
        currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// 处理键盘输入
function handleKeyPress(e) {
    if (!isActive) return;
    
    // 忽略功能键和修饰键
    if (e.ctrlKey || e.altKey || e.metaKey || 
        ['Control', 'Alt', 'Shift', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
    }
    
    // 阻止默认行为，避免页面滚动等
    e.preventDefault();
    
    // 如果是第一次按键，开始计时
    if (startTime === null) {
        startTime = new Date();
        timer = setInterval(updateTimer, 1000);
    }
    
    const expectedChar = currentText.charAt(totalTyped);
    const typedChar = e.key;
    
    // 检查是否输入正确
    if (typedChar === expectedChar) {
        // 正确输入
        totalTyped++;
        displayText(totalTyped);
        
        // 标记按键为正确
        markKeyCorrect(typedChar);
        
        // 如果是最后一个字符，完成打字测试
        if (totalTyped === currentText.length) {
            finishTyping();
        }
    } else {
        // 错误输入
        errors++;
        errorCount.textContent = errors;
        
        // 标记按键为错误
        markKeyIncorrect(typedChar);
    }
    
    // 更新统计
    updateStats();
}

// 标记按键为正确
function markKeyCorrect(char) {
    const key = char.toLowerCase();
    let keyElement;
    
    if (key === ' ') {
        keyElement = document.querySelector('.key[data-key=" "]');
    } else {
        keyElement = document.querySelector(`.key[data-key="${key}"]`);
    }
    
    if (keyElement) {
        keyElement.classList.add('key-correct');
        
        // 2秒后移除正确标记
        setTimeout(() => {
            keyElement.classList.remove('key-correct');
        }, 2000);
    }
}

// 标记按键为错误
function markKeyIncorrect(char) {
    const key = char.toLowerCase();
    let keyElement;
    
    if (key === ' ') {
        keyElement = document.querySelector('.key[data-key=" "]');
    } else {
        keyElement = document.querySelector(`.key[data-key="${key}"]`);
    }
    
    if (keyElement) {
        keyElement.classList.add('key-incorrect');
        
        // 2秒后移除错误标记
        setTimeout(() => {
            keyElement.classList.remove('key-incorrect');
        }, 2000);
    }
}

// 更新统计
function updateStats() {
    if (startTime === null) return;
    
    // 计算WPM (Words Per Minute)
    const timeElapsed = (new Date() - startTime) / 1000 / 60; // 转换为分钟
    const wpm = Math.round((totalTyped / 5) / timeElapsed); // 假设一个单词平均5个字符
    
    // 计算CPM (Characters Per Minute)
    const cpm = Math.round(totalTyped / timeElapsed);
    
    // 计算准确率
    const accuracy = Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100)) || 100;
    
    // 更新显示
    wpmDisplay.textContent = wpm;
    cpmDisplay.textContent = cpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    
    // 更新进度条
    updateProgressBar();
}

// 更新计时器
function updateTimer() {
    const seconds = Math.floor((new Date() - startTime) / 1000);
    timeDisplay.textContent = `${seconds}s`;
}

// 完成打字
function finishTyping() {
    clearInterval(timer);
    isActive = false;
    
    // 移除键盘监听
    document.removeEventListener('keydown', handleKeyPress);
    
    startButton.textContent = '开始';
    
    // 计算最终统计
    updateStats();
    
    // 显示结果弹窗
    showResultsModal();
    
    // 重置所有键盘高亮
    resetKeyboardHighlights();
}

// 显示结果弹窗
function showResultsModal() {
    const modal = document.getElementById('results-modal');
    const resultErrors = document.getElementById('result-errors');
    const resultWpm = document.getElementById('result-wpm');
    const resultCpm = document.getElementById('result-cpm');
    const resultAccuracy = document.getElementById('result-accuracy');
    
    // 填充结果数据
    resultErrors.textContent = errors;
    resultWpm.textContent = wpmDisplay.textContent;
    resultCpm.textContent = cpmDisplay.textContent;
    resultAccuracy.textContent = accuracyDisplay.textContent;
    
    // 显示弹窗
    modal.style.display = 'block';
    
    // 关闭按钮事件
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    // 点击弹窗外部关闭
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // 再试一次按钮事件
    const tryAgainBtn = document.getElementById('try-again-btn');
    tryAgainBtn.onclick = function() {
        modal.style.display = 'none';
        startTyping();
    };
}

// 更新进度条
function updateProgressBar() {
    if (!currentText) return;
    // 计算完成百分比（基于已正确输入的字符数）
    const typedCharacters = totalTyped;
    const totalCharacters = currentText.length;
    const progressPercentage = Math.min(100, Math.max(0, (typedCharacters / totalCharacters) * 100));
    // 更新进度条宽度
    progressBar.style.width = `${progressPercentage}%`;
}

// 重置进度条
function resetProgressBar() {
    progressBar.style.width = '0%';
}
