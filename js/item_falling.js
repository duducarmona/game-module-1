class ItemFalling {
    constructor(ctx, gameWidth, gameHeight, speed) {
        this.width = 50;
        this.height = 60;
        this.x = 0;
        this.y = 0;
        this.ctx = ctx;
        this.frequency = 100;
        this.direction = 0;     // Right = 0, Left = 1
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.speed = speed;
        this.image = undefined;
        this.type = undefined;  // LAB/Kata = 0, Beer = 1
    }

    _newPos() {
        // this.y++;
        this.y += this.speed;

        if (this.direction === 0) {
            // this.x++;   // Go to the right
            this.x += this.speed;
        }
        else {
            // this.x--;   // Go to the left
            this.x -= this.speed;
        }

        if (this.x < 0) {
            this.x = 0;
            this.direction = 0;
        }
        else if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
            this.direction = 1;
        }
    }

    update() {
        this._newPos();
            
        const image = new Image()

        image.src = this.image;
        this.ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}