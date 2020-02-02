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
        this.level = 0;
        this.levelsArray = ['December', 'January', 'February', 'March', 'April', 'May', 'June']
        this.arrayItemsFalling = [];
        this.itemFallingSpeed = 1;
        this.gameOver = callback;
        this.arrayBeers = [];
        this.beersFrecuency = 1000;
        this.pause = false;
        this.fired = false;
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOn = true;
    }

    _assignControlsToKeys() {
        this.ironhacker.image = '../images/ironhacker_right.png';

        document.addEventListener('keydown', e => {
            if (this.gameOn) {
                switch (e.keyCode) {
                    case 37:    // arrow left
                        this.ironhacker.image = '../images/ironhacker_left.png';
                        this.ironhacker.moveLeft();
                        break;
                    case 39:    // arrow right
                        this.ironhacker.image = '../images/ironhacker_right.png';
                        this.ironhacker.moveRight();
                        break;
                    case 80:    // pause
                        if(!this.fired) {
                            this.fired = true;
                            this._pause();
                        }
                        break;
                }
            }
        });

        document.addEventListener('keyup', e => {
            this.ironhacker.speedX = 0;
            this.fired = false;
        });
    }

    _pause() {
        if(this.pause) {
            this.pauseScreen.setAttribute('class', 'disabled');
            this.start();
            this.pause = false;
        }
        else {
            this._stop();
            this.pauseScreen.removeAttribute('class');
            this.pauseScreen.setAttribute('class', 'flex');
            this.pause = true;
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
            if (element.y + element.height >= this.height) {
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
    }

    _collidesWithIronhacker() {
        const arrayReturn = [];

        arrayReturn[0] = this.arrayItemsFalling.some((element) => {    
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
    }

    _reverseAssignControlsToKeys() {
        this.ironhacker.image = '../images/ironhacker_drunk_left.png';

        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: // arrow left
                    this.ironhacker.image = '../images/ironhacker_drunk_left.png';
                    this.ironhacker.moveRight();
                    break;
                case 39: // arrow right
                    this.ironhacker.image = '../images/ironhacker_drunk_right.png';
                    this.ironhacker.moveLeft();
                    break;
            }
        })

        document.addEventListener('keyup', e => {
            this.ironhacker.speedX = 0;
        })
    }

    _reverseIronhackerMovement() {
        const DRUNK_TIME = 10000;

        this._reverseAssignControlsToKeys();
        setTimeout(this._assignControlsToKeys.bind(this), DRUNK_TIME);
    }

    _updateSubmittedItems() {
        this.HTMLSubmittedItems.innerText = this.submittedItems;
    }

    _updateSubmittedFails() {
        this.HTMLSubmittedFails.innerText = this.submittedFails;
    }

    _updateLevel() {
        this.HTMLLevel.innerText = this.levelsArray[++this.level];
    }

    _updateItemsToComplete() {
        this.HTMLItemsToComplete.innerText = parseInt(this.HTMLItemsToComplete.innerText) + 5;
    }

    _updateMaxFails() {
        this.HTMLMaxFails.innerText = parseInt(this.HTMLItemsToComplete.innerText) * 0.2;
    }

    _ironhackerWon() {
        return this.level === this.levelsArray.length - 1;
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

    _generateIronbeers() {
        if (this.interval % this.beersFrecuency === 0) {
            const MAX_BEERS = 20;
            const BEER_SPEED = 2;
            const distanceBetweenBeers = 300;

            for (let i = 0; i < MAX_BEERS; i++) {
                const beer = new ItemFalling(this.ctx, this.width, this.height, BEER_SPEED);
                const x = (i * distanceBetweenBeers) % this.width;
                const direction = Math.floor(Math.random() * 2);

                beer.x = x;
                beer.direction = direction;
                beer.image = '../images/beer_02_turned.png';
                beer.type = 1;
                this.arrayItemsFalling.push(beer);
            }
        }
    }

    _checkCollisionsWithGround() {
        const arrayCollides = this._collidesWithGround();

        if (arrayCollides[0] && arrayCollides[1] === 0) {
            // Show warning.
            this.submittedFails++;
            this._updateSubmittedFails();

            if (this.submittedFails > this.HTMLMaxFails.innerText) {
                this.gameOn = false;
                this.gameOver();
                this._stop();
            } 
        }
    }

    _checkCollisionsWithIronhacker() {
        const arrayCollides = this._collidesWithIronhacker();

        if (arrayCollides[0]) {
            switch (arrayCollides[1]) {
                case 0:
                    this.submittedItems++;
                    this._updateSubmittedItems();
        
                    if (this.submittedItems == this.HTMLItemsToComplete.innerText) {
                        if (this._ironhackerWon()) {
                            // Mostrar pantalla de ganador y terminar juego.
                            alert('Congratulations Ironhacker! You have graduated!');
                        }
                        else {
                            this._goToNextLevel();
                        }
                    }
                    break;
                case 1:
                    this._reverseIronhackerMovement();
                    break;
                default:
                    break;
            }
        }
    }

    _checkCollisions() {
        this._checkCollisionsWithGround();
        this._checkCollisionsWithIronhacker();
    }

    _update() {
        this._cleanScreen();
        this.ironhacker.update();
        this._generateItemsFalling();
        this._generateIronbeers();
        this._updateItemsFalling();
        this._checkCollisions();

        if (!!this.interval) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
    }

    start() {
        this.gameOn = true;
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