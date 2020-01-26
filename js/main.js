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
    });

    function start() {
        game.start();
    }
})