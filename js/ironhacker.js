class Ironhacker {
    constructor(ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.ctx.fillStyle = 'blue';
        this.width = 30;
        this.height = 30;
        this.x = (this.gameWidth - this.width) / 2;
        this.y = (this.gameHeight - this.height);
        this.speedX = 0;
        this.speedY = 0;
        this.speed = 5;
    }

    _newPos() {
        this.x += this.speedX;
        
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
    }

    update() {
        this._newPos();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        this.speedX = 0;
        this.speedX -= this.speed;
    }

    moveRight() {
        this.speedX = 0;
        this.speedX += this.speed;
    }
}