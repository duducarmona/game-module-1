class Game {
    constructor(options, callback) {
        this.ctx = options.ctx;
        this.ironhacker = options.ironhacker;
        this.interval = undefined;
        this.width = options.width;
        this.height = options.height;
        this.itemsFalling = options.itemsFalling;
        this.submittedItems = 0;
        this.HTMLSubmittedItems = document.getElementById('submitted-items');
        this.submittedFails = 0;
        this.HTMLSubmittedFails = document.getElementById('submitted-fails');
        this.HTMLMaxFails = document.getElementById('max-fails');
        this.HTMLItemsToComplete = document.getElementById('items-to-complete');
        this.HTMLLevel = document.getElementById('level');
        this.level = 1;
        this.arrayItemsFalling = [];
        this.itemFallingSpeed = 1;
        this.gameOver = callback;
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

    _generateItemsFalling() {
        let generate = false;

        // if (this.itemsFalling.arrayItems.length > 0) {
        //     const y = this.itemsFalling.arrayItems[this.itemsFalling.arrayItems.length - 1].y;
        if (this.arrayItemsFalling.length > 0) {
            const y = this.arrayItemsFalling[this.arrayItemsFalling.length - 1].y;

            if (y > this.itemsFalling.frequency) {
                generate = true;
            }
        }
        else {
            generate = true;
        }

        if (generate) {
            const itemFalling = new ItemsFalling(this.ctx, this.width, this.height, this.itemFallingSpeed);
            const x = Math.floor(Math.random() * this.width - itemFalling.width);
            const direction = Math.floor(Math.random() * 2);
            
            itemFalling.x = x;
            itemFalling.direction = direction;

            // this.itemsFalling.arrayItems.push(itemFalling);
            this.arrayItemsFalling.push(itemFalling);
        }
    }

    _collidesWithGround() {
        return this.arrayItemsFalling.some((element) => {
            if (element.y + element.height === this.height) {
                this.arrayItemsFalling.shift();

                return true;
            }
            else {
                return false;
            }
        })
    }

    _collidesWithIronhacker() {
        // return this.itemsFalling.arrayItems.some((element) => {
        return this.arrayItemsFalling.some((element) => {    
            if (
                element.y + element.height >= this.height - this.ironhacker.height &&   // Item at the height of the player.
                (
                    (   // Collision on the left of the player.
                        element.x + element.width >= this.ironhacker.x &&
                        element.x + element.width <= this.ironhacker.x + this.ironhacker.width
                    ) ||
                    (   // Collision on the right of the player.
                        this.ironhacker.x + this.ironhacker.height >= element.x &&
                        this.ironhacker.x + this.ironhacker.height <= element.x + element.width
                    )
                )
            ) {
                // this.itemsFalling.arrayItems.shift();
                this.arrayItemsFalling.shift();
                return true;
            }
            else {
                return false;
            }
        })
    }

    _updateSubmittedItems() {
        this.HTMLSubmittedItems.innerText = this.submittedItems;
    }

    _updateSubmittedFails() {
        this.HTMLSubmittedFails.innerText = this.submittedFails;
    }

    _updateLevel() {
        this.HTMLLevel.innerText = ++this.level;
    }

    _updateItemsToComplete() {
        this.HTMLItemsToComplete.innerText = parseInt(this.HTMLItemsToComplete.innerText) + 5;
    }

    _updateMaxFails() {
        this.HTMLMaxFails.innerText = parseInt(this.HTMLItemsToComplete.innerText) * 0.2;
    }

    _goToNextLevel() {
        this._updateLevel();
        // this._updateItemsToComplete();
        // this._updateMaxFails();
        this.submittedItems = 0;
        this._updateSubmittedItems();
        this.submittedFails = 0;
        this._updateSubmittedFails();
        // this.itemsFalling.frequency *= 0.3;
        // this.itemFallingSpeed += 1;
    }

    _update() {
        this._cleanScreen();
        this.ironhacker.update();
        this._generateItemsFalling();

        for (let i = 0; i < this.arrayItemsFalling.length; i++) {
            this.arrayItemsFalling[i].update();
        }

        if (this._collidesWithGround()) {
            // Show warning.
            this.submittedFails++;
            this._updateSubmittedFails();

            if (this.submittedFails <= this.HTMLMaxFails.innerText) {
                // alert('GAME OVER');
                this.gameOver();
                this._stop();
                document.location.reload();
            } 
        }

        if (this._collidesWithIronhacker()) {
            this.submittedItems++;
            this._updateSubmittedItems();

            if (this.submittedItems == this.HTMLItemsToComplete.innerText) {
                alert('Congratulations! You survived another day at Ironhack!');
                this._goToNextLevel();
            }
        }

        if (!!this.interval) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
    }

    start() {
        this._assignControlsToKeys();
        this.interval = window.requestAnimationFrame(this._update.bind(this));
    }

    _stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}