class Game {
    constructor(options, callback) {
        this.ctx = options.ctx;
        this.ironhacker = options.ironhacker;
        this.interval = undefined;
        this.width = options.width;
        this.height = options.height;
        this.itemFalling = options.itemFalling;
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
        this.arrayBeers = [];
        this.beersTime = undefined;
        this.pause = 0;     // 0: game running, 1: game paused
    }

    _assignControlsToKeys() {
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37:    // arrow left
                    this.ironhacker.moveLeft();
                    break;
                case 39:    // arrow right
                    this.ironhacker.moveRight();
                    break;
                case 80:    // pause
                    this._pause();
                    break;
            }
        })

        document.addEventListener('keyup', e => {
            this.ironhacker.speedX = 0;
        })
    }

    _pause() {
        if(this.pause === 0) {
            this._stop();
            this.pause = 1;
        }
        else {
            this.start();
            this.pause = 0;
        }
    }

    _cleanScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    _generateItemsFalling() {
        let generate = false;

        if (this.arrayItemsFalling.length > 0) {
            const y = this.arrayItemsFalling[this.arrayItemsFalling.length - 1].y;

            if (y > this.itemFalling.frequency) {
                generate = true;
            }
        }
        else {
            generate = true;
        }

        if (generate) {
            const itemFalling = new ItemFalling(this.ctx, this.width, this.height, this.itemFallingSpeed);
            const x = Math.floor(Math.random() * this.width - itemFalling.width);
            const direction = Math.floor(Math.random() * 2);
            const labKata = Math.floor(Math.random() * 2);
            
            itemFalling.x = x;
            itemFalling.direction = direction;
            itemFalling.type = 0;

            if (labKata === 0) {
                itemFalling.image = 'images/lab.png';
            }
            else {
                itemFalling.image = 'images/kata.png';
            }

            this.arrayItemsFalling.push(itemFalling);
        }
    }

    _collidesWithGround() {
        const arrayReturn = [];

        arrayReturn[0] = this.arrayItemsFalling.some((element) => {
                                // if (element.y + element.height === this.height) {
                                if (element.y + element.height >= this.height) {
                                    // this.arrayItemsFalling.shift();
                                    const pos = this.arrayItemsFalling.indexOf(element);
                    
                                    this.arrayItemsFalling.splice(pos, 1);
                    
                                    arrayReturn[1] = element.type;

                                    return true;
                                }
                                else {
                                    return false;
                                }
                            })

        return arrayReturn;

        // return this.arrayItemsFalling.some((element) => {
        //     // if (element.y + element.height === this.height) {
        //     if (element.y + element.height >= this.height) {
        //         // this.arrayItemsFalling.shift();
        //         const pos = this.arrayItemsFalling.indexOf(element);

        //         this.arrayItemsFalling.splice(pos, 1);

        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // })
    }

    _reverseAssignControlsToKeys() {
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: // arrow left
                    this.ironhacker.moveRight();
                    break;
                case 39: // arrow right
                    this.ironhacker.moveLeft();
                    break;
            }
        })

        document.addEventListener('keyup', e => {
            this.ironhacker.speedX = 0;
        })
    }

    _reverseIronhackerMovement() {
        this._reverseAssignControlsToKeys();
        setTimeout(this._assignControlsToKeys.bind(this), 10000);
    }

    _collidesWithIronhacker() {
        let result = undefined;
        let elementType = undefined;

        result = this.arrayItemsFalling.some((element) => {    
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
                // this.arrayItemsFalling.shift();
                const pos = this.arrayItemsFalling.indexOf(element);

                this.arrayItemsFalling.splice(pos, 1);

                elementType = element.type;

                return true;
            }
            else {
                return false;
            }
        })

        if (elementType === 1) {    // Beer
            // Reverse the Ironhacker's movement
            this._reverseIronhackerMovement();
        }

        return result;

        // return this.arrayItemsFalling.some((element) => {    
        //     if (
        //         element.y + element.height >= this.height - this.ironhacker.height &&   // Item at the height of the player.
        //         (
        //             (   // Collision on the left of the player.
        //                 element.x + element.width >= this.ironhacker.x &&
        //                 element.x + element.width <= this.ironhacker.x + this.ironhacker.width
        //             ) ||
        //             (   // Collision on the right of the player.
        //                 this.ironhacker.x + this.ironhacker.height >= element.x &&
        //                 this.ironhacker.x + this.ironhacker.height <= element.x + element.width
        //             )
        //         )
        //     ) {
        //         // this.arrayItemsFalling.shift();
        //         const pos = this.arrayItemsFalling.indexOf(element);

        //         this.arrayItemsFalling.splice(pos, 1);

        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // })
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
        this.submittedItems = 0;
        this._updateSubmittedItems();
        this.submittedFails = 0;
        this._updateSubmittedFails();
        // this.itemsFalling.frequency *= 0.3;
        // this.itemFallingSpeed += 1;
    }

    _updateItemsFalling() {
        for (let i = 0; i < this.arrayItemsFalling.length; i++) {
            this.arrayItemsFalling[i].update();
        }
    }

    _update() {
        this._cleanScreen();
        this.ironhacker.update();
        this._generateItemsFalling();

        // for (let i = 0; i < this.arrayItemsFalling.length; i++) {
        //     this.arrayItemsFalling[i].update();
        // }

        // if (!!this.beersTime) {
        //     this.beersTime = setTimeout(this._generateIronbeers.bind(this), 10000);
        // }
        if (this.interval % 1000 === 0) {
            this._generateIronbeers();
        }

        for (let i = 0; i < this.arrayBeers.length; i++) {
            this.arrayBeers[i].update();
        }

        this._updateItemsFalling();

        let arrayCollides = this._collidesWithGround();

        // if (this._collidesWithGround()) {
        if (arrayCollides[0] && arrayCollides[1] === 0) {
            // Show warning.
            this.submittedFails++;
            this._updateSubmittedFails();

            if (this.submittedFails > this.HTMLMaxFails.innerText) {
                this.gameOver();
                this._stop();
                // document.location.reload();
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

    _generateIronbeers() {
        const MAX_BEERS = 20;
        const BEER_SPEED = 2;
        // const arrayBeers = [];
        const distanceBetweenBeers = 300;

        for (let i = 0; i < MAX_BEERS; i++) {
            const beer = new ItemFalling(this.ctx, this.width, this.height, BEER_SPEED);
            // const x = Math.floor(Math.random() * this.width - itemFalling.width);
            const x = (i * distanceBetweenBeers) % this.width;
            const direction = Math.floor(Math.random() * 2);

            beer.x = x;
            beer.direction = direction;
            beer.image = 'images/beer_02_turned.png';
            beer.type = 1;

            // this.arrayBeers.push(beer);
            this.arrayItemsFalling.push(beer);
        }

        // for (let i = 0; i < this.arrayBeers.length; i++) {
        //     this.arrayBeers[i].update();
        // }
    }
}