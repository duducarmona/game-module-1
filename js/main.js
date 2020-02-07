let ctx;
let game;

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('ironhack');
    const startContainer = document.getElementById('start-container');
    const submitsChart = document.getElementById('submits-chart');
    const titleOnCanvas = document.getElementById('title-on-canvas');
    const body = document.getElementById('body');

    ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('start-button');
    startBtn.addEventListener('click', start);

    const tryAgainBtn = document.getElementById('try-again-button');
    tryAgainBtn.addEventListener('click', () => {
        document.location.reload();
    });

    const playAgainBtn = document.getElementById('play-again-button');
    playAgainBtn.addEventListener('click', () => {
        document.location.reload();
    });

    game = new Game({
        ctx,
        width: canvas.width,
        height: canvas.height,
        ironhacker: new Ironhacker(ctx, canvas.width, canvas.height),
        itemFalling: new ItemFalling(ctx, canvas.width, canvas.height)
    },
    gameOver);

    const audioStart = new Audio('./audio/stranger_things.mp3');

    audioStart.play();

    function start() {
        audioStart.pause();
        audioStart.currentTime = 0;

        canvas.removeAttribute('class');
        submitsChart.removeAttribute('class');
        submitsChart.setAttribute('class', 'flex');
        titleOnCanvas.removeAttribute('class');
        startContainer.setAttribute('class', 'disabled');
        body.style.backgroundColor = '#207AB2';

        game.start();
    }

    function gameOver() {
        let gameOver = document.getElementById('game-over');
        const audioGameOver = new Audio('/audio/game_over.mp3');

        audioGameOver.play();
        gameOver.removeAttribute('class');
        gameOver.setAttribute('class', 'flex');
    }
})