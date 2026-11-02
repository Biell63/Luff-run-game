// Elementos principais do jogo
const luffy = document.querySelector('.luffy');
const gameBoard = document.querySelector('.game-board');
const gameover = document.querySelector('.game-over-message');
const restartButton = document.querySelector('.restart-button');

// Imagens usadas nos obstáculos
const obstacleImages = [
    './imagens/agua.png',
    './imagens/aguamenor.png',
    './imagens/nuvemchuva.png'
];

// Variáveis de controle
let obstacles = [];
let loop = null;
let spawn = null;
let isJumping = false;

// Define a área de colisão dos elementos
const HITBOX = {
    LUFFY_X: 18,
    LUFFY_Y: 20,
    OBSTACLE_X: 28,
    OBSTACLE_Y: 24
};

// Calcula a área de colisão de um elemento
const hitbox = (el, padX, padY) => {
    const r = el.getBoundingClientRect();

    return {
        left: r.left + padX,
        right: r.right - padX,
        top: r.top + padY,
        bottom: r.bottom - padY
    };
};

// Verifica se o Luffy encostou em algum obstáculo
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

// Executa o pulo do personagem
const jump = () => {
    if (isJumping) return;

    isJumping = true;
    luffy.classList.add('jump');
};

// Detecta quando a animação do pulo termina
luffy.addEventListener('animationend', (e) => {
    if (e.animationName !== 'luffy-jump') return;

    luffy.classList.remove('jump');
    isJumping = false;
});

// Cria obstáculos aleatórios no cenário
const createObstacle = () => {
    const obs = document.createElement('img');
    const img = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    obs.src = img;
    obs.className = 'obstacle';

    if (img.includes('nuvem')) obs.classList.add('cloud');

    gameBoard.appendChild(obs);
    obstacles.push(obs);

    // Remove o obstáculo depois de um tempo
    setTimeout(() => {
        obs.remove();
        obstacles = obstacles.filter(o => o !== obs);
    }, 3500);
};

// Finaliza a partida quando ocorre uma colisão
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

// Prepara e inicia uma nova partida
const startGame = () => {
    luffy.src = './imagens/luffy.gif';
    luffy.classList.remove('jump');
    isJumping = false;

    // Limpa os obstáculos da partida anterior
    obstacles.forEach(o => o.remove());
    obstacles = [];

    gameover.style.display = 'none';
    restartButton.style.display = 'none';

    clearInterval(loop);
    clearInterval(spawn);

    // Cria novos obstáculos a cada 1,6 segundos
    spawn = setInterval(createObstacle, 1600);

    // Verifica colisões durante o jogo
    loop = setInterval(() => {
        obstacles.forEach(obs => {
            if (!isColliding(luffy, obs)) return;

            // As nuvens só causam colisão quando o Luffy está pulando
            if (obs.classList.contains('cloud') && !isJumping) return;

            gameOver();
        });
    }, 16);
};

// Controles do jogo
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', startGame);

// Inicia o jogo ao carregar a página
startGame();
