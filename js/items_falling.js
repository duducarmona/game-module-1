class ItemsFalling {
    constructor(ctx, gameWidth, gameHeight) {
        this.width = 20;
        this.height = 30;
        this.x = 0;
        this.y = 0;
        this.arrayItems = [];
        this.ctx = ctx;
        this.frequency = 100;
        this.direction = 0;     // Right = 0, Left = 1
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.speed = 1;
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
        this.ctx.fillStyle = 'tomato';

        for (let i = 0; i < this.arrayItems.length; i++) {
            this.arrayItems[i]._newPos();
            this.ctx.fillRect(this.arrayItems[i].x, this.arrayItems[i].y, this.arrayItems[i].width, this.arrayItems[i].height);
        }
    }

    collidesWithGround() {
        return this.arrayItems.some((element) => {
            if (element.y + element.height === this.gameHeight) {
                this.arrayItems.shift();

                return true;
            }
            else {
                return false;
            }
        })
    }
}