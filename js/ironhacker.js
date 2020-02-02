class Ironhacker {
    constructor(ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 75;
        this.height = 100;
        this.x = (this.gameWidth - this.width) / 2;
        this.y = (this.gameHeight - this.height);
        this.speedX = 0;
        this.speed = 10;
        this.image = '../images/ironhacker_right.png';
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
        
        const image = new Image()

        image.src = this.image;

        this.ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        this.speedX = 0;
        this.speedX -= this.speed;
        // this.x -= this.speed;
    }

    moveRight() {
        this.speedX = 0;
        this.speedX += this.speed;
        // this.x += this.speed;
    }
}