class Game {
    constructor(options, callback) {
        this.ctx = options.ctx;
        this.ironhacker = options.ironhacker;
        this.interval = undefined;
        this.width = options.width;
        this.height = options.height;
        this.itemFalling = options.itemFalling;
        this.submittedItems = 0;
        this.submittedFails = 0;
        this.HTMLLevel = document.getElementById('level');
        this.level = 0;
        this.levelsArray = ['DECEMBER', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE'];
        this.arrayItemsFalling = [];
        this.itemFallingSpeed = 1;
        this.itemsFallingFrequency = 100;
        this.gameOver = callback;
        // this.beersFrecuency = 500;
        // this.coffeeFrecuency = 750;
        // this.zzzFrecuency = 1000;
        this.beersFrecuency = 1;
        this.coffeeFrecuency = 1;
        this.zzzFrecuency = 1;
        this.pause = false;
        this.fired = false;
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOn = true;
        this.graduatedScreen = document.getElementById('graduated');
        this.levelCompletedScreen = document.getElementById('level-completed');
        this.countDown = document.getElementById('count-down');
        this.monthComing = document.getElementById('month-coming');
        this.timer = undefined;
        this.counter = 3;
        this.okCountDown = true;
        this.scoreLabKata = document.getElementById('score-lab-kata');
        this.scoreLabKataFail = document.getElementById('score-lab-kata-fail');
        this.labsKatasToComplete = 10;
        this.maxFails = 2;
        this.audioGame = new Audio('./audio/chemical_brothers_go.mp3');
        this.ironhackerImageRight = './images/ironhacker_right.png';
        this.ironhackerImageLeft = './images/ironhacker_left.png';
        this.ironhackerDrunkImageRight = './images/ironhacker_drunk_right.png';
        this.ironhackerDrunkImageLeft = './images/ironhacker_drunk_left.png';
        this.ironhackerCoffeeImageRight = './images/ironhacker_coffee_right.png';
        this.ironhackerCoffeeImageLeft = './images/ironhacker_coffee_left.png';
        this.ironhackerZZZImageRight = './images/ironhacker_zzz_right.png';
        this.ironhackerZZZImageLeft = './images/ironhacker_zzz_left.png';
        this.incrementIronhackerSpeed = 5;
        this.ironhackerOriginalSpeed = this.ironhacker.speed;
        this.stateInterval = undefined;
        this.counterItems = 0;
    }

    _assignControlsToKeys() {
        let ironhackerImageRight = this.ironhackerImageRight;
        let ironhackerImageLeft = this.ironhackerImageLeft;

        this.ironhacker.image = ironhackerImageRight;

        document.addEventListener('keydown', e => {
            switch (this.ironhacker.state) {
                case 0:
                    ironhackerImageRight = this.ironhackerImageRight;
                    ironhackerImageLeft = this.ironhackerImageLeft;
    
                    break;
                case 1:
                    ironhackerImageRight = this.ironhackerDrunkImageRight;
                    ironhackerImageLeft = this.ironhackerDrunkImageLeft;
                    break;
                case 2:
                    ironhackerImageRight = this.ironhackerCoffeeImageRight;
                    ironhackerImageLeft = this.ironhackerCoffeeImageLeft;
                    break;
                case 3:
                    ironhackerImageRight = this.ironhackerZZZImageRight;
                    ironhackerImageLeft = this.ironhackerZZZImageLeft;
                    break;
                default:
                    break;
            }

            if (this.gameOn) {
                switch (e.keyCode) {
                    case 37:    // arrow left
                        this.ironhacker.image = ironhackerImageLeft;
                        this.ironhacker.moveLeft();
                        break;
                    case 39:    // arrow right
                        this.ironhacker.image = ironhackerImageRight;
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
            this.audioGame.pause();
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

            if (y > this.itemsFallingFrequency) {
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
                itemFalling.image = './images/lab.png';
            }
            else {
                itemFalling.image = './images/kata.png';
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
        this.ironhacker.image = './images/ironhacker_drunk_left.png';

        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: // arrow left
                    this.ironhacker.image = './images/ironhacker_drunk_left.png';
                    this.ironhacker.moveRight();
                    break;
                case 39: // arrow right
                    this.ironhacker.image = './images/ironhacker_drunk_right.png';
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

        this.ironhacker.state = 1;
        this._reverseAssignControlsToKeys();

        this.stateInterval = setTimeout(() => {
            this._assignControlsToKeys();
            this.ironhacker.state = 0;
        }, DRUNK_TIME);
    }

    _updateLevel() {
        this.HTMLLevel.innerText = this.levelsArray[++this.level];
    }

    _ironhackerWon() {
        return this.level === this.levelsArray.length - 1;
    }
    
    _startCountDownLevel() {
        this.timer = setTimeout(this._countDown.bind(this), 500);
    }

    _countDown() {
        let counterToShow = this.counter;

        if (this.okCountDown) {
            this.countDown.style.fontSize = '200px';
        }
        else {
            if (this.counter === 0) {
                --this.counter;
                this.levelCompletedScreen.removeAttribute('class');
                this.levelCompletedScreen.setAttribute('class', 'disabled');
            }
            else {
                this.countDown.innerText = '';
                this.countDown.style.fontSize = '100px';

                if (this.counter > 1) {
                    this.counter--;
                    this.countDown.innerText = --counterToShow;
                }
                else {
                    this.countDown.innerText = 'GO!';
                    --this.counter;
                }
            }
        }

        if (this.counter < 0)
        {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.counter = 3;
            this.countDown.style.fontSize = '100px';
            this.countDown.innerText = this.counter;
            this._updateLevel();
            this._clearScore();
            this._clearFails();
            this.start();
        }
        else
        {
            this.timer = setTimeout(this._countDown.bind(this), 500);
        }

        this.okCountDown = !this.okCountDown;
    }

    _goToNextLevel() {
        this._stop();
        this.monthComing.innerText = this.levelsArray[this.level + 1];
        this.levelCompletedScreen.removeAttribute('class');
        this.levelCompletedScreen.setAttribute('class', 'flex');
        this.submittedItems = 0;
        this.submittedFails = 0;
        this.itemFallingSpeed += 0.2;
        this.itemsFallingFrequency -= 5;
        this.arrayItemsFalling = [];
        this.ironhacker.x = (this.width - this.ironhacker.width) / 2;
        this.ironhacker.y = (this.height - this.ironhacker.height);
        this._startCountDownLevel();
        
        if (this.stateInterval) {
            clearTimeout(this.stateInterval);
            this.ironhacker.state = 0;
        }
    }

    _updateItemsFalling() {
        for (let i = 0; i < this.arrayItemsFalling.length; i++) {
            this.arrayItemsFalling[i].update();
        }
    }

    _generateIronbeers() {
        if (this.interval % this.beersFrecuency === 0) {
            const MAX_BEERS = 5;
            const BEER_SPEED = 2;
            const distanceBetweenBeers = 300;

            for (let i = 0; i < MAX_BEERS; i++) {
                const beer = new ItemFalling(this.ctx, this.width, this.height, BEER_SPEED);
                // const x = (i * distanceBetweenBeers) % this.width;
                const x = Math.floor(Math.random() * this.width - beer.width);
                const direction = Math.floor(Math.random() * 2);

                beer.x = x;
                beer.direction = direction;
                beer.image = './images/beer_02_turned.png';
                beer.type = 1;
                this.arrayItemsFalling.push(beer);
            }
        }
    }

    _generateZzz() {
        if (this.interval % this.zzzFrecuency === 0) {
            const MAX_ZZZ = 5;
            const ZZZ_SPEED = 2;
            const distanceBetweenZzz = 300;

            for (let i = 0; i < MAX_ZZZ; i++) {
                const zzz = new ItemFalling(this.ctx, this.width, this.height, ZZZ_SPEED);
                // const x = (i * distanceBetweenZzz) % this.width;
                const x = Math.floor(Math.random() * this.width - zzz.width);
                const direction = Math.floor(Math.random() * 2);

                zzz.x = x;
                zzz.direction = direction;
                zzz.image = './images/zzz.png';
                zzz.type = 3;
                this.arrayItemsFalling.push(zzz);
            }
        }
    }

    _generateCoffee() {
        if (this.interval % this.coffeeFrecuency === 0) {
            const coffee = new ItemFalling(this.ctx, this.width, this.height, this.itemFallingSpeed);
            const x = Math.floor(Math.random() * this.width - coffee.width);
            const direction = Math.floor(Math.random() * 2);

            coffee.x = x;
            coffee.direction = direction;
            coffee.type = 2;
            coffee.image = './images/coffee.png'

            this.arrayItemsFalling.push(coffee);
        }
    }

    _graduated() {
        const audioWin = new Audio('/audio/applause.mp3');

        audioWin.play();
        this._stop();
        this.gameOn = false;
        this.graduatedScreen.removeAttribute('class');
        this.graduatedScreen.setAttribute('class', 'flex');
    }

    _checkCollisionsWithGround() {
        const arrayCollides = this._collidesWithGround();

        if (arrayCollides[0] && arrayCollides[1] === 0) {
            const audioLoseTask = new Audio('./audio/task_lose.wav');
                    
            audioLoseTask.play();
            
            this._fillFails();
            this.submittedFails++;

            if (this.submittedFails > this.maxFails) {
                this.gameOn = false;
                this.audioGame.pause();
                this.gameOver();
                this._stop();
            } 
        }
    }

    _fillScore() {
        this.scoreLabKata.children[this.submittedItems].style.backgroundColor = '#2B97BF'; 
    }

    _fillFails() {
        this.scoreLabKataFail.children[this.submittedFails].style.backgroundColor = 'red'; 
    }

    _clearScore() {
        for (let i = 0; i < this.scoreLabKata.children.length; i++) {
            this.scoreLabKata.children[i].style.backgroundColor = 'transparent'; 
        }
    }

    _clearFails() {
        for (let i = 0; i < this.scoreLabKataFail.children.length; i++) {
            this.scoreLabKataFail.children[i].style.backgroundColor = 'transparent'; 
        }
    }

    _checkCollisionsWithIronhacker() {
        const arrayCollides = this._collidesWithIronhacker();

        if (arrayCollides[0]) {
            switch (arrayCollides[1]) {
                case 0:
                    const audioCaught = new Audio('./audio/task_caught.wav');
                    
                    audioCaught.play();

                    this._fillScore();
                    this.submittedItems++;

                    if (this.submittedItems == this.labsKatasToComplete) {
                        if (this._ironhackerWon()) {
                            this._graduated();
                        }
                        else {
                            this._goToNextLevel();
                        }
                    }
                    break;
                case 1:
                    const audioBurp = new Audio('./audio/burp.mp3');
                    
                    audioBurp.play();

                    if (this.stateInterval) {
                        clearTimeout(this.stateInterval);
                        this._setNormal();
                    }

                    this._reverseIronhackerMovement();
                    break;
                case 2:
                    const audioCoffee = new Audio('./audio/yee_haw.mp3');

                    audioCoffee.play();

                    if (this.stateInterval) {
                        clearTimeout(this.stateInterval);
                        this._setNormal();
                    }

                    this._acceleratesIronhacker();
                    break;
                case 3:
                    const audioZzz = new Audio('/audio/snore.wav');

                    audioZzz.play();

                    if (this.stateInterval) {
                        clearTimeout(this.stateInterval);
                        this._setNormal();
                    }

                    this._slowDownIronhacker();
                default:
                    break;
            }
        }
    }

    _setNormal() {
        this.ironhacker.state = 0;
        this.ironhacker.speed = this.ironhackerOriginalSpeed;
        console.log(this.ironhacker.speed);
        this._assignControlsToKeys();
    }

    _acceleratesIronhacker() {
        const COFFEE_TIME = 10000;

        this.ironhacker.image = '/images/ironhacker_coffee_right.png';
        this.ironhacker.speed += this.incrementIronhackerSpeed;
        this.ironhacker.state = 2;

        this.stateInterval = setTimeout(() => {}, COFFEE_TIME);
    }

    _slowDownIronhacker() {
        const ZZZ_TIME = 10000;

        this.ironhacker.image = '/images/ironhacker_zzz_right.png';
        this.ironhacker.speed -= this.incrementIronhackerSpeed;
        this.ironhacker.state = 3;

        this.stateInterval = setTimeout(() => {}, ZZZ_TIME);
    }

    _checkCollisions() {
        this._checkCollisionsWithGround();
        this._checkCollisionsWithIronhacker();
    }

    _update() {
        this._cleanScreen();
        this.ironhacker.update();
        this._generateItemsFalling();
        if (this.interval % 500 === 0) {
            if(this.counterItems === 0) {
                this._generateIronbeers();
                this.counterItems++;
            }
            else if (this.counterItems === 1) {
                this._generateCoffee();
                this.counterItems++;
            }
            else {
                this._generateZzz();
                this.counterItems = 0;
            }
        }
        // this._generateIronbeers();
        // this._generateCoffee();
        // this._generateZzz();
        this._updateItemsFalling();
        this._checkCollisions();

        if (!!this.interval) {
            this.interval = window.requestAnimationFrame(this._update.bind(this));
        }
    }

    start() {
        this.audioGame.play();

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