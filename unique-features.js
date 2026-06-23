/**
 * ====================================================
 * UNIQUE PORTFOLIO FEATURES
 * 5 interactive features to make this portfolio unique
 * ====================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNowPlaying();
    initKonamiCode();
    initContributionHeatmap();
    initCursorParticles();
    initDevLogTicker();
});

/* ─────────────────────────────────────────────
   1. SPOTIFY-STYLE "NOW PLAYING" WIDGET
   ───────────────────────────────────────────── */
function initNowPlaying() {
    const widget = document.getElementById('now-playing-widget');
    if (!widget) return;

    const moods = [
        { emoji: '🎧', title: 'Deep Focus Mode', subtitle: 'Lofi Beats & Algorithms', color: '#66d9ef' },
        { emoji: '🐛', title: 'Debugging Session', subtitle: 'Console.log("why?!")', color: '#ff6b9d' },
        { emoji: '🚀', title: 'Deploy Day!', subtitle: 'Ship it & pray', color: '#a8e6cf' },
        { emoji: '☕', title: 'Coffee & Code', subtitle: 'Morning productivity', color: '#ffd93d' },
        { emoji: '🧠', title: 'AI Training Time', subtitle: 'Teaching machines to think', color: '#bd93f9' },
        { emoji: '🔧', title: 'Refactor Marathon', subtitle: 'Making ugly code beautiful', color: '#ff8c00' },
        { emoji: '📚', title: 'Learning Mode', subtitle: 'Stack Overflow surfing', color: '#50fa7b' },
        { emoji: '🌙', title: 'Late Night Coding', subtitle: 'Best ideas at 3am', color: '#ff79c6' }
    ];

    let currentMood = 0;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const moodEmoji = widget.querySelector('.np-mood-emoji');
    const moodTitle = widget.querySelector('.np-title');
    const moodSubtitle = widget.querySelector('.np-subtitle');
    const nextBtn = widget.querySelector('.np-next-btn');
    const prevBtn = widget.querySelector('.np-prev-btn');

    function updateMood(direction = 1) {
        currentMood = (currentMood + direction + moods.length) % moods.length;
        const mood = moods[currentMood];

        // Animate out
        widget.classList.add('np-switching');
        setTimeout(() => {
            moodEmoji.textContent = mood.emoji;
            moodTitle.textContent = mood.title;
            moodSubtitle.textContent = mood.subtitle;
            widget.style.setProperty('--np-accent', mood.color);
            widget.classList.remove('np-switching');
        }, 200);
    }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateMood(1); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateMood(-1); });

    // Auto-cycle every 8 seconds
    let autoCycle = setInterval(() => updateMood(1), 8000);

    // Pause auto-cycle on hover
    widget.addEventListener('mouseenter', () => clearInterval(autoCycle));
    widget.addEventListener('mouseleave', () => {
        autoCycle = setInterval(() => updateMood(1), 8000);
    });

    // Draggable functionality
    widget.addEventListener('mousedown', (e) => {
        if (e.target.closest('.np-next-btn') || e.target.closest('.np-prev-btn')) return;
        isDragging = true;
        const rect = widget.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        widget.style.cursor = 'grabbing';
        widget.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        widget.style.position = 'fixed';
        widget.style.left = x + 'px';
        widget.style.top = y + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        widget.style.cursor = 'grab';
        widget.style.transition = '';
    });

    // Set initial mood
    const mood = moods[currentMood];
    widget.style.setProperty('--np-accent', mood.color);
}

/* ─────────────────────────────────────────────
   2. KONAMI CODE EASTER EGG + CODE PUZZLE
   ───────────────────────────────────────────── */
function initKonamiCode() {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    const modal = document.getElementById('konami-modal');
    if (!modal) return;

    const puzzleArea = modal.querySelector('.puzzle-code-area');
    const checkBtn = modal.querySelector('.puzzle-check-btn');
    const hintBtn = modal.querySelector('.puzzle-hint-btn');
    const resultArea = modal.querySelector('.puzzle-result');
    const closeBtn = modal.querySelector('.konami-close-btn');
    const funFactsArea = modal.querySelector('.fun-facts-area');

    const puzzles = [
        {
            scrambled: ['console.log("Hello!");', 'const name = "Subra";', 'function greet(n) {', '  return `Hi, ${n}!`;', '}'],
            correct: ['const name = "Subra";', 'function greet(n) {', '  return `Hi, ${n}!`;', '}', 'console.log("Hello!");'],
            hint: 'Declare variables before using them. Functions go before the call!'
        },
        {
            scrambled: ['return sum;', 'sum += arr[i];', 'let sum = 0;', 'for(let i=0; i<arr.length; i++){', '}'],
            correct: ['let sum = 0;', 'for(let i=0; i<arr.length; i++){', 'sum += arr[i];', '}', 'return sum;'],
            hint: 'Initialize → Loop → Accumulate → Close → Return'
        },
        {
            scrambled: ['.then(data => render(data))', 'async function fetchData() {', 'const res = await fetch(url);', 'return res.json();', '}'],
            correct: ['async function fetchData() {', 'const res = await fetch(url);', 'return res.json();', '}', '.then(data => render(data))'],
            hint: 'Function declaration → fetch → parse → close → chain'
        }
    ];

    const funFacts = [
        "🎮 I once spent 6 hours debugging only to find a missing semicolon",
        "☕ My average coffee-to-code ratio is 3 cups per feature",
        "🌙 My best code is written between 11pm and 3am",
        "🐛 I talk to my rubber duck more than my colleagues",
        "🎵 I can't code without music — silence is a bug",
        "📚 I read documentation for fun on weekends (sometimes)",
        "🤖 My first program was a calculator in C++ at age 17",
        "🏃 I debug by going on walks — 60% of the time, it works every time"
    ];

    let currentPuzzle = null;
    let lineElements = [];

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiIndex = 0;
                activateEasterEgg();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadPuzzle();

        // Screen flash effect
        const flash = document.createElement('div');
        flash.className = 'konami-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
    }

    function loadPuzzle() {
        currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        renderPuzzle();
        if (resultArea) resultArea.innerHTML = '';
        if (funFactsArea) funFactsArea.classList.remove('visible');
    }

    function renderPuzzle() {
        if (!puzzleArea) return;
        puzzleArea.innerHTML = '';
        lineElements = [];

        // Create shuffled version
        const shuffled = [...currentPuzzle.scrambled];

        shuffled.forEach((line, idx) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'puzzle-line';
            lineEl.draggable = true;
            lineEl.dataset.index = idx;

            const lineNum = document.createElement('span');
            lineNum.className = 'puzzle-line-num';
            lineNum.textContent = idx + 1;

            const lineCode = document.createElement('code');
            lineCode.className = 'puzzle-line-code';
            lineCode.textContent = line;

            const grip = document.createElement('span');
            grip.className = 'puzzle-grip';
            grip.textContent = '⠿';

            lineEl.appendChild(grip);
            lineEl.appendChild(lineNum);
            lineEl.appendChild(lineCode);
            puzzleArea.appendChild(lineEl);
            lineElements.push(lineEl);

            // Drag events
            lineEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
                lineEl.classList.add('dragging');
            });

            lineEl.addEventListener('dragend', () => {
                lineEl.classList.remove('dragging');
                updateLineNumbers();
            });

            lineEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                const dragging = puzzleArea.querySelector('.dragging');
                if (dragging && dragging !== lineEl) {
                    const rect = lineEl.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    if (e.clientY < midY) {
                        puzzleArea.insertBefore(dragging, lineEl);
                    } else {
                        puzzleArea.insertBefore(dragging, lineEl.nextSibling);
                    }
                }
            });
        });
    }

    function updateLineNumbers() {
        const lines = puzzleArea.querySelectorAll('.puzzle-line');
        lines.forEach((line, idx) => {
            line.querySelector('.puzzle-line-num').textContent = idx + 1;
        });
    }

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const currentOrder = Array.from(puzzleArea.querySelectorAll('.puzzle-line-code')).map(el => el.textContent);
            const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(currentPuzzle.correct);

            if (isCorrect) {
                resultArea.innerHTML = '<span class="puzzle-success">🎉 Correct! You think like a developer!</span>';
                puzzleArea.querySelectorAll('.puzzle-line').forEach(l => l.classList.add('correct'));

                // Show fun facts
                setTimeout(() => {
                    if (funFactsArea) {
                        funFactsArea.innerHTML = '<h3>🎊 Secret Fun Facts Unlocked!</h3>';
                        const shuffledFacts = funFacts.sort(() => Math.random() - 0.5).slice(0, 5);
                        shuffledFacts.forEach((fact, i) => {
                            const factEl = document.createElement('p');
                            factEl.className = 'fun-fact';
                            factEl.textContent = fact;
                            factEl.style.animationDelay = `${i * 0.15}s`;
                            funFactsArea.appendChild(factEl);
                        });
                        funFactsArea.classList.add('visible');
                    }
                }, 600);
            } else {
                resultArea.innerHTML = '<span class="puzzle-error">❌ Not quite! Try rearranging the lines.</span>';
                puzzleArea.querySelectorAll('.puzzle-line').forEach(l => {
                    l.classList.add('shake');
                    setTimeout(() => l.classList.remove('shake'), 500);
                });
            }
        });
    }

    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            if (resultArea && currentPuzzle) {
                resultArea.innerHTML = `<span class="puzzle-hint">💡 ${currentPuzzle.hint}</span>`;
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ─────────────────────────────────────────────
   3. GITHUB-STYLE CONTRIBUTION HEATMAP
   ───────────────────────────────────────────── */
function initContributionHeatmap() {
    const container = document.getElementById('contribution-heatmap');
    if (!container) return;

    const grid = container.querySelector('.heatmap-grid');
    const tooltip = container.querySelector('.heatmap-tooltip');
    const totalCount = container.querySelector('.heatmap-total-count');
    if (!grid) return;

    // Generate realistic-looking data for 52 weeks
    const activities = [
        'Python scripting', 'React components', 'TensorFlow models',
        'OpenCV pipelines', 'Node.js APIs', 'C++ firmware',
        'Docker configs', 'CSS styling', 'SQL queries',
        'Arduino sketches', 'Git management', 'Documentation',
        'Code reviews', 'Testing', 'Bug fixes',
        'Research papers', 'Algorithm design', 'UI prototyping'
    ];

    const weeks = 52;
    const days = 7;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let totalContributions = 0;
    const data = [];

    // Generate data with realistic patterns (more activity on weekdays, bursts during project phases)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (weeks * 7));

    for (let w = 0; w < weeks; w++) {
        const weekData = [];
        // Create "project burst" periods
        const isBurstWeek = (w > 5 && w < 15) || (w > 25 && w < 35) || (w > 40 && w < 48);
        const isSlowWeek = (w > 15 && w < 20) || (w > 48);

        for (let d = 0; d < days; d++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (w * 7 + d));

            let maxContrib = 8;
            if (isBurstWeek) maxContrib = 14;
            if (isSlowWeek) maxContrib = 3;
            if (d === 0 || d === 6) maxContrib = Math.floor(maxContrib * 0.4); // Less on weekends

            const count = Math.floor(Math.random() * maxContrib);
            totalContributions += count;

            weekData.push({
                count,
                date: currentDate,
                activity: activities[Math.floor(Math.random() * activities.length)]
            });
        }
        data.push(weekData);
    }

    if (totalCount) totalCount.textContent = totalContributions;

    // Build SVG-like grid using divs
    // Add month labels
    const monthLabelRow = document.createElement('div');
    monthLabelRow.className = 'heatmap-month-labels';
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
        const cellDate = data[w][0].date;
        const month = cellDate.getMonth();
        const label = document.createElement('span');
        label.className = 'heatmap-month-label';
        if (month !== lastMonth) {
            label.textContent = monthNames[month];
            lastMonth = month;
        }
        monthLabelRow.appendChild(label);
    }
    grid.appendChild(monthLabelRow);

    // Add day labels + cells
    for (let d = 0; d < days; d++) {
        const row = document.createElement('div');
        row.className = 'heatmap-row';

        const dayLabel = document.createElement('span');
        dayLabel.className = 'heatmap-day-label';
        dayLabel.textContent = (d % 2 === 1) ? dayNames[d] : '';
        row.appendChild(dayLabel);

        for (let w = 0; w < weeks; w++) {
            const cellData = data[w][d];
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';

            // Determine intensity level (0-4)
            let level = 0;
            if (cellData.count > 0) level = 1;
            if (cellData.count > 3) level = 2;
            if (cellData.count > 6) level = 3;
            if (cellData.count > 10) level = 4;
            cell.dataset.level = level;

            // Add entrance animation delay
            cell.style.animationDelay = `${(w * 7 + d) * 3}ms`;

            // Tooltip on hover
            cell.addEventListener('mouseenter', (e) => {
                const dateStr = cellData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const text = cellData.count === 0
                    ? `No contributions on ${dateStr}`
                    : `${cellData.count} contributions on ${dateStr}<br><small>${cellData.activity}</small>`;
                tooltip.innerHTML = text;
                tooltip.classList.add('visible');

                const rect = cell.getBoundingClientRect();
                const gridRect = grid.getBoundingClientRect();
                tooltip.style.left = (rect.left - gridRect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - gridRect.top - 8) + 'px';
            });

            cell.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });

            row.appendChild(cell);
        }
        grid.appendChild(row);
    }

    // Animate cells appearing with IntersectionObserver
    const heatmapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('heatmap-animate');
                heatmapObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    heatmapObserver.observe(container);
}

/* ─────────────────────────────────────────────
   4. MAGNETIC CURSOR TRAIL WITH PARTICLES
   ───────────────────────────────────────────── */
function initCursorParticles() {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    if (window.innerWidth < 768) return;

    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -100, y: -100 };
    let animationId;

    const colors = ['#66d9ef', '#ffd93d', '#a8e6cf', '#ff6b9d', '#bd93f9', '#ff8c00'];
    const shapes = ['square', 'triangle', 'circle'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.rotation += this.rotationSpeed;
            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;

            const s = this.size;

            switch (this.shape) {
                case 'square':
                    ctx.fillRect(-s / 2, -s / 2, s, s);
                    ctx.strokeRect(-s / 2, -s / 2, s, s);
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(0, -s / 2);
                    ctx.lineTo(-s / 2, s / 2);
                    ctx.lineTo(s / 2, s / 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    break;
            }

            ctx.restore();
        }
    }

    let frameCount = 0;

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Spawn particles every few frames
        frameCount++;
        if (frameCount % 3 === 0) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
    });

    document.addEventListener('click', (e) => {
        // Burst of particles on click
        for (let i = 0; i < 8; i++) {
            const p = new Particle(e.clientX, e.clientY);
            p.speedX = (Math.random() - 0.5) * 8;
            p.speedY = (Math.random() - 0.5) * 8;
            p.size = Math.random() * 12 + 6;
            particles.push(p);
        }
    });

    // Magnetic effect for interactive elements
    const magneticElements = document.querySelectorAll('.nav-link, .nav-cta, .social-btn, .btn-cta, .contact-card, .creator-github, .np-next-btn, .np-prev-btn');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);

        // Cap max particles for performance
        if (particles.length > 80) {
            particles = particles.slice(-80);
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Clean up on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ─────────────────────────────────────────────
   5. INTERACTIVE DEV LOG TICKER TAPE
   ───────────────────────────────────────────── */
function initDevLogTicker() {
    const ticker = document.getElementById('dev-log-ticker');
    if (!ticker) return;

    const track = ticker.querySelector('.ticker-track');
    if (!track) return;

    const logs = [
        "Day 1: Hello World ✅ — the journey begins 🚀",
        "Day 14: Learned Python. Everything is a dictionary now 📖",
        "Day 30: First ML model — it predicts everything is a cat 🐱",
        "Day 52: The CSS is centering. I repeat, the div is CENTERED 🎯",
        "Day 78: Discovered Docker. My laptop is now a ship captain 🐳",
        "Day 103: The bug was a semicolon. It's ALWAYS a semicolon ;",
        "Day 127: Git merge conflict at 2am. Send help 🆘",
        "Day 156: Built my first API. It returns 404 on everything 🤷",
        "Day 189: TensorFlow model training... *3 hours later* ...still training ⏳",
        "Day 210: Deployed to production on a Friday. Living dangerously 😎",
        "Day 247: Finally understood why CSS is called Cascading 🌊",
        "Day 280: Code review comment: 'This is clever.' Translation: 'This is unreadable.' 💀",
        "Day 312: Arduino project works! ...sometimes. On Tuesdays. When it's cloudy ☁️",
        "Day 340: Wrote documentation. Nobody reads it, but I feel responsible 📝",
        "Day 365: One year of coding. Would do it all again. Mostly. Maybe. ❤️",
        "Day 400: OpenCV detected my face. At least someone recognizes me 📸",
        "Day 420: The neural network is learning. I'm still learning CSS 😅",
        "Day 450: Published IEEE paper. Mom finally understands I 'work with computers' 🎓"
    ];

    // Duplicate logs for seamless infinite scroll
    const allLogs = [...logs, ...logs];

    allLogs.forEach(log => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.innerHTML = `<span class="ticker-dot">◆</span> ${log}`;
        track.appendChild(item);
    });

    // Pause on hover
    ticker.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    ticker.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });

    // Calculate animation duration based on content width
    requestAnimationFrame(() => {
        const trackWidth = track.scrollWidth / 2;
        const speed = 60; // pixels per second
        const duration = trackWidth / speed;
        track.style.animationDuration = `${duration}s`;
    });
}
