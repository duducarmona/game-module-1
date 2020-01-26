class ItemsFalling {
    constructor(ctx) {
        this.width = 20;
        this.height = 30;
        this.x = 0;
        this.y = 0;
        this.arrayItems = [];
        this.ctx = ctx;
        this.frequency = 100;
        this.direction = 0;
    }

    _newPos() {
        this.y++;

        if (this.direction === 0) {
            this.x++;   // Go to the right
        }
        else {
            this.x--;   // Go to the left
        }
    }

    update() {
        this.ctx.fillStyle = 'tomato';

        for (let i = 0; i < this.arrayItems.length; i++) {
            // Obtengo la y del último elemento, si es > 30, lanzo otro
            this.arrayItems[i]._newPos();
            this.ctx.fillRect(this.arrayItems[i].x, this.arrayItems[i].y, this.arrayItems[i].width, this.arrayItems[i].height);
        }
    }
}