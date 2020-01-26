class Game {
    constructor(options) {
        this.ctx = options.ctx;
        this.ironhacker = options.ironhacker;
        this.interval = undefined;
        this.width = options.width;
        this.height = options.height;
        this.itemsFalling = options.itemsFalling;
    }

    _assignControlsToKeys() {
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: // arrow left
                    this.ironhacker.moveLeft();
                    break;
                case 39: // arrow right
                    this.ironhacker.moveRight();
                    break;
            }
        })

        document.addEventListener('keyup', e => {
            this.ironhacker.speedX = 0;
        })
    }

    _cleanScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // _drawItemsFalling() {
    //     this.ctx.fillStyle = "tomato";
    //     this.ctx.fillRect(0, 0, 20, 30);
    //   }

    _generateItemsFalling() {
        let generate = false;

        if (this.itemsFalling.arrayItems.length > 0) {
            const y = this.itemsFalling.arrayItems[this.itemsFalling.arrayItems.length - 1].y;

            if (y > this.itemsFalling.frequency) {
                generate = true;
            }
        }
        else {
            generate = true;
        }

        if (generate) {
            const itemFalling = new ItemsFalling(ctx);
            const x = Math.floor(Math.random() * this.width - itemFalling.width);
            const direction = Math.floor(Math.random() * 2);
            
            itemFalling.x = x;
            itemFalling.direction = direction;

            this.itemsFalling.arrayItems.push(itemFalling);
        }
    }

    _update() {
        this._cleanScreen();
        this.ironhacker.update();
        // this._drawItemsFalling();
        this._generateItemsFalling();
        this.itemsFalling.update();

        if (!!this.interval) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
    }

    start() {
        this._assignControlsToKeys();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
}