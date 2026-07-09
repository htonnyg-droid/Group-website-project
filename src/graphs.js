const yellow = document.getElementById('yellow');
const pink = document.getElementById('pink');
const blue = document.getElementById('blue');
const green = document.getElementById('green');
const greenright = document.getElementById('greenright');
const red = document.getElementById('red');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');

const isLg = () => window.innerWidth >= 1024;
const boxes = [yellow, pink, blue, green, red];
const cache = new Map();

function getDocTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
}

function cachePositions() {
    boxes.forEach(el => {
        // Reset any inline styles before measuring
        el.style.position = '';
        el.style.top = '';
        el.style.left = '';
        el.style.width = '';

        const rect = el.getBoundingClientRect();
        cache.set(el, {
            docTop: rect.top + window.scrollY,
            left: rect.left,
            width: rect.width,
        });
    });
}

let triggers = [];

function cacheTriggers() {
    if (isLg()) {
        triggers = [
            { el: yellow, stickAt: cache.get(yellow).docTop, unstickAt: cache.get(green).docTop },
            { el: pink,   stickAt: cache.get(pink).docTop,   unstickAt: getDocTop(text3) },
            { el: blue,   stickAt: cache.get(blue).docTop,   unstickAt: getDocTop(text1) },
            { el: green,  stickAt: cache.get(green).docTop,  unstickAt: getDocTop(text2) },
            { el: red,    stickAt: cache.get(red).docTop,    unstickAt: getDocTop(text3) },
        ];
    } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        triggers = [
            { el: yellow, stickAt: cache.get(yellow).docTop, unstickAt: maxScroll * 0.4 },
            { el: pink,   stickAt: cache.get(pink).docTop,   unstickAt: maxScroll * 0.9 },
            { el: green,  stickAt: cache.get(green).docTop,  unstickAt: maxScroll * 0.7 },
            { el: blue,   stickAt: cache.get(blue).docTop,   unstickAt: maxScroll * 0.6 },
            { el: red,    stickAt: cache.get(red).docTop,    unstickAt: maxScroll * 0.9 },
        ];
    }
}

window.addEventListener('load', () => {
    cachePositions();
    cacheTriggers();
});

window.addEventListener('resize', () => {
    cachePositions();
    cacheTriggers();
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    triggers.forEach(({ el, stickAt, unstickAt }) => {
        const c = cache.get(el);
        if (scrollY >= stickAt && scrollY < unstickAt) {
            el.style.position = 'fixed';
            el.style.top = '0px';
            el.style.left = c.left + 'px';
            el.style.width = c.width + 'px';
        } else {
            el.style.position = 'absolute';
            el.style.top = '';
            el.style.left = '';
            el.style.width = '';
        }
    });
});
