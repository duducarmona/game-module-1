let ctx;
let game;

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('ironhack');
    const startContainer = document.getElementById('start-container');
    const submitsChart = document.getElementById('submits-chart');

    ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('start-button');
    startBtn.addEventListener('click', start);

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
        startContainer.setAttribute('class', 'disabled');

        game.start();
    }

    function gameOver() {
        let gameOver = document.getElementById('game-over');

        gameOver.removeAttribute('class');
        canvas.setAttribute('class', 'disabled');
        submitsChart.setAttribute('class', 'disabled');
    }
})