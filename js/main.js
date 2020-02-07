let ctx;
let game;

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('ironhack');
    const startContainer = document.getElementById('start-container');
    const submitsChart = document.getElementById('submits-chart');
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

    function start() {
        canvas.removeAttribute('class');
        submitsChart.removeAttribute('class');
        submitsChart.setAttribute('class', 'flex');
        startContainer.setAttribute('class', 'disabled');
        body.style.backgroundColor = '#46CDFA'

        game.start();
    }

    function gameOver() {
        let gameOver = document.getElementById('game-over');

        gameOver.removeAttribute('class');
        gameOver.setAttribute('class', 'flex');
    }
})