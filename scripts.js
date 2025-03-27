window.addEventListener('load', () => {
    const heroText = document.getElementById("hero-text");
    if (heroText) {
        // Attach a scroll-trigger tween immediately
        gsap.to(heroText, {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top", // when the hero section hits the top of the viewport
                end: "+=100",     // animation completes over the next 100px of scrolling
                scrub: true
            },
            y: -120,
            opacity: 0,
            ease: "power3.out"
        });
    }
});

// Smooth scrolling for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

gsap.utils.toArray('.animate-up').forEach(elem => {
    let startValue = 'top 80%'; // default start for other sections
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: startValue,
            toggleActions: 'play none none reverse',
            scrub: true
        },
        y: 120,
        opacity: 0,
        duration: 2,
        ease: 'elastic.out(1, 0.3)'
    });
});

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            // Increase the random delay range to slow down the effect
            const start = Math.floor(Math.random() * 80);
            const end = start + Math.floor(Math.random() * 80);
            this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function cycleWords(el, words, delay = 2000) {
    let counter = 0;
    const fx = new TextScramble(el);

    function next() {
        fx.setText(words[counter]).then(() => {
            setTimeout(() => {
                counter = (counter + 1) % words.length;
                next();
            }, delay);
        });
    }

    next();
}

window.addEventListener('load', () => {
    const heroP = document.getElementById('hero-text-p');
    if (heroP) {
        // You can customize the array of words/phrases as needed.
        const phrases = [
            "Check out my work below",
            "I love coding",
            "Developer"
        ];
        cycleWords(heroP, phrases, 2000);
    }
});