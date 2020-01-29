let ctx;
let game;

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('ironhack');
    ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('start');
    startBtn.addEventListener('click', start);

    game = new Game({
        ctx,
        width: canvas.width,
        height: canvas.height,
        ironhacker: new Ironhacker(ctx, canvas.width, canvas.height),
        itemsFalling: new ItemsFalling(ctx, canvas.width, canvas.height)
    },
    gameOver);

    function start() {
        let start = document.getElementById("start-container");

        canvas.removeAttribute('class');
        start.setAttribute('class', 'disabled');
        // canvas.style = "display: block";
        // container.style = "display: block";
        // start.style = "display: none";

        // let base_image = new Image();
        // base_image.src = '../images/ironhacker.png';
        // base_image.onload = function(){
        //     ctx.drawImage(base_image, 0, 0);
        // }

        game.start();
    }

    function gameOver() {
        let gameOver = document.getElementById('game-over');

        gameOver.removeAttribute('class');
        canvas.setAttribute('class', 'disabled');
        start.setAttribute('class', 'disabled');
    }
})