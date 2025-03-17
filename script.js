document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const maxCountdowns = 12;
    let countdowns = [];
    let mouseX = 0, mouseY = 0;
    let mouseSpeed = 0;
    let lastMouseX = 0, lastMouseY = 0;

    // 数字时钟字体加载
    const fontStyleSheet = document.createElement('style');
    fontStyleSheet.textContent = `
        @font-face {
            font-family: 'Digital-7';
            src: url('https://cdn.jsdelivr.net/npm/digital-7-font@1.0.0/digital-7.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(fontStyleSheet);

    // 跟踪鼠标位置和速度
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 计算鼠标速度
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        mouseSpeed = Math.sqrt(dx*dx + dy*dy);
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        
        // 速度越快，创建更多倒计时
        if (mouseSpeed > 30 && countdowns.length < maxCountdowns && Math.random() > 0.8) {
            createRandomCountdown();
        }
        
        // 移动现有倒计时（小概率）
        if (Math.random() > 0.95) {
            countdowns.forEach(countdown => {
                // 随机选择元素进行移动或变化
                if (Math.random() > 0.7) {
                    const newX = Math.random() * window.innerWidth;
                    const newY = Math.random() * window.innerHeight;
                    
                    countdown.x = newX;
                    countdown.y = newY;
                    countdown.element.style.left = `${newX}px`;
                    countdown.element.style.top = `${newY}px`;
                }
            });
        }
    });
    
    // 初始创建几个倒计时
    for (let i = 0; i < 5; i++) {
        createRandomCountdown();
    }
    
    // 每隔一段时间创建新的倒计时
    setInterval(() => {
        if (countdowns.length < maxCountdowns && Math.random() > 0.7) {
            createRandomCountdown();
        }
    }, 5000);

    function createRandomCountdown() {
        // 创建倒计时元素
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        
        // 随机选择类型：数字时钟或几何形状
        const isDigitalClock = Math.random() > 0.4;
        
        if (isDigitalClock) {
            countdownElement.classList.add('digital');
        } else {
            countdownElement.classList.add('shape');
            
            // 随机选择几何形状
            const shapes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            countdownElement.classList.add(shape);
            
            // 几何形状添加背景色
            if (Math.random() > 0.5) {
                // 有50%几率是纯白背景
                countdownElement.style.backgroundColor = '#fff';
                countdownElement.style.color = '#000';
            } else {
                // 否则选择灰度颜色
                const grayLevel = Math.floor(Math.random() * 200) + 55;
                countdownElement.style.backgroundColor = `rgb(${grayLevel}, ${grayLevel}, ${grayLevel})`;
            }
        }
        
        // 随机位置
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 200);
        
        // 随机大小
        const sizeType = Math.random();
        let size;
        
        if (isDigitalClock) {
            // 数字时钟的尺寸
            if (sizeType < 0.7) { // 70%几率中等大小
                size = 30 + Math.random() * 50;
            } else if (sizeType < 0.9) { // 20%几率小尺寸
                size = 15 + Math.random() * 15;
            } else { // 10%几率大尺寸
                size = 80 + Math.random() * 120;
            }
            countdownElement.style.fontSize = `${size}px`;
        } else {
            // 几何形状的尺寸
            if (sizeType < 0.6) { // 60%几率中等大小
                size = 60 + Math.random() * 80;
            } else if (sizeType < 0.9) { // 30%几率小尺寸
                size = 30 + Math.random() * 30;
            } else { // 10%几率大尺寸
                size = 150 + Math.random() * 200;
            }
            countdownElement.style.width = `${size}px`;
            countdownElement.style.height = `${size}px`;
            countdownElement.style.fontSize = `${size * 0.3}px`;
        }
        
        // 随机焦虑效果
        const effects = ['', 'effect-flicker', 'effect-pulse', 'effect-shake'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        if (effect) countdownElement.classList.add(effect);
        
        // 随机透明度
        const opacity = 0.7 + Math.random() * 0.3;
        
        // 应用样式
        countdownElement.style.left = `${x}px`;
        countdownElement.style.top = `${y}px`;
        countdownElement.style.opacity = opacity;
        
        container.appendChild(countdownElement);
        
        // 随机时间（5秒到5分钟）
        const duration = 5 + Math.floor(Math.random() * 295);
        let timeLeft = duration;
        
        // 随机时间格式
        const formatType = Math.floor(Math.random() * 4);
        
        // 创建倒计时对象并添加到数组
        const countdown = {
            element: countdownElement,
            isDigital: isDigitalClock,
            duration: duration,
            timeLeft: timeLeft,
            formatType: formatType,
            x: x,
            y: y,
            interval: null
        };
        
        countdowns.push(countdown);
        
        // 启动倒计时
        countdown.interval = setInterval(() => {
            countdown.timeLeft--;
            
            // 更新倒计时文本
            updateCountdownDisplay(countdown);
            
            if (countdown.timeLeft <= 0) {
                clearInterval(countdown.interval);
                container.removeChild(countdown.element);
                countdowns = countdowns.filter(item => item !== countdown);
            }
        }, 1000);
        
        // 初始显示
        updateCountdownDisplay(countdown);
        
        return countdown;
    }
    
    function updateCountdownDisplay(countdown) {
        let displayText = '';
        
        if (countdown.isDigital) {
            // 数字时钟格式
            switch(countdown.formatType) {
                case 0: // MM:SS
                    const minutes = Math.floor(countdown.timeLeft / 60);
                    const seconds = countdown.timeLeft % 60;
                    displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    break;
                case 1: // HH:MM:SS
                    const hours = Math.floor(countdown.timeLeft / 3600);
                    const mins = Math.floor((countdown.timeLeft % 3600) / 60);
                    const secs = countdown.timeLeft % 60;
                    displayText = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    break;
                case 2: // SS
                    displayText = countdown.timeLeft.toString().padStart(2, '0');
                    break;
                case 3: // MM.SS
                    const m = Math.floor(countdown.timeLeft / 60);
                    const s = countdown.timeLeft % 60;
                    displayText = `${m.toString().padStart(2, '0')}.${s.toString().padStart(2, '0')}`;
                    break;
            }
        } else {
            // 几何形状内的格式
            switch(countdown.formatType) {
                case 0: // 秒
                    displayText = `${countdown.timeLeft}秒`;
                    break;
                case 1: // 分:秒
                    const minutes = Math.floor(countdown.timeLeft / 60);
                    const seconds = countdown.timeLeft % 60;
                    displayText = `${minutes}:${seconds}`;
                    break;
                case 2: // 只显示秒
                    displayText = `${countdown.timeLeft}`;
                    break;
                case 3: // 自定义格式
                    if (countdown.timeLeft > 60) {
                        const mins = Math.floor(countdown.timeLeft / 60);
                        displayText = `${mins}分`;
                    } else {
                        displayText = `${countdown.timeLeft}秒`;
                    }
                    break;
            }
        }
        
        countdown.element.textContent = displayText;
        
        // 时间越少越焦虑
        if (countdown.timeLeft < countdown.duration * 0.2) {
            if (!countdown.element.classList.contains('effect-shake')) {
                countdown.element.classList.add('effect-shake');
            }
        }
        
        // 倒计时到最后10秒时闪烁
        if (countdown.timeLeft <= 10 && !countdown.element.classList.contains('effect-flicker')) {
            countdown.element.classList.add('effect-flicker');
        }
        
        // 偶尔随机移动 (小概率事件)
        if (countdown.timeLeft % 10 === 0 && Math.random() > 0.8) {
            const newX = Math.random() * (window.innerWidth - 200);
            const newY = Math.random() * (window.innerHeight - 200);
            
            countdown.x = newX;
            countdown.y = newY;
            
            countdown.element.style.left = `${newX}px`;
            countdown.element.style.top = `${newY}px`;
        }
    }
});