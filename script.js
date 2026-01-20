const luffy = document.querySelector('.luffy');
const gameBoard = document.querySelector('.game-board');
const gameover = document.querySelector('.game-over-message');
const restartButton = document.querySelector('.restart-button');

const obstacleImages = [
    './imagens/agua.png',
    './imagens/aguamenor.png',
    './imagens/nuvemchuva.png'
];
let obstacles = [];
let loop = null;
let spawn = null;
let isJumping = false;
const HITBOX = {
    LUFFY_X: 18,
    LUFFY_Y: 20,
    OBSTACLE_X: 28,
    OBSTACLE_Y: 24
};
const hitbox = (el, padX, padY) => {
    const r = el.getBoundingClientRect();
    return {
        left: r.left + padX,
        right: r.right - padX,
        top: r.top + padY,
        bottom: r.bottom - padY
    };
};

const isColliding = (a, b) => {
    const A = hitbox(a, HITBOX.LUFFY_X, HITBOX.LUFFY_Y);
    const B = hitbox(b, HITBOX.OBSTACLE_X, HITBOX.OBSTACLE_Y);

    return (
        A.right > B.left &&
        A.left < B.right &&
        A.bottom > B.top &&
        A.top < B.bottom
    );
};
const jump = () => {
    if (isJumping) return;
    isJumping = true;
    luffy.classList.add('jump');
};
luffy.addEventListener('animationend', (e) => {
    if (e.animationName !== 'luffy-jump') return;
    luffy.classList.remove('jump');
    isJumping = false;
});
const createObstacle = () => {
    const obs = document.createElement('img');
    const img = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    obs.src = img;
    obs.className = 'obstacle';
    if (img.includes('nuvem')) obs.classList.add('cloud');

    gameBoard.appendChild(obs);
    obstacles.push(obs);

    setTimeout(() => {
        obs.remove();
        obstacles = obstacles.filter(o => o !== obs);
    }, 3500);
};
const gameOver = () => {
    obstacles.forEach(o => {
        o.style.animation = 'none';
        o.style.left = `${o.offsetLeft}px`;
    });

    clearInterval(loop);
    clearInterval(spawn);

    luffy.src = './imagens/gameover.png';
    gameover.style.display = 'block';
    restartButton.style.display = 'block';
};

const startGame = () => {
    luffy.src = './imagens/luffy.gif';
    luffy.classList.remove('jump');
    isJumping = false;
    obstacles.forEach(o => o.remove());
    obstacles = [];
    gameover.style.display = 'none';
    restartButton.style.display = 'none';

    clearInterval(loop);
    clearInterval(spawn);

    spawn = setInterval(createObstacle, 1600);

    loop = setInterval(() => {
        obstacles.forEach(obs => {
            if (!isColliding(luffy, obs)) return;
            if (obs.classList.contains('cloud') && !isJumping) return;

            gameOver();
        });
    }, 16);
};
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', startGame);

startGame();
