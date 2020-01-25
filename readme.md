# Ironhack. The intensive game

The purpose of the game is to try to catch and make the maximum number of 'LABs' and 'katas' before they reach the ground.

The game screen is an interface from which 'LABs', 'katas' and other items will fall.

The player is represented by an image of a student whose function is to catch the 'LABs' and 'katas'.
The movement of the player is horizontal, for this the left arrow and right arrow keys of the keyboard are used that make the player move in the corresponding direction.

The game ends when the player passes all phases or loses all their lives.

Extra: Student behavior can be affected positively or negatively by coming into contact with different types of items:

- __Coffee__: Positive. It makes the student move faster temporarily.
- __TA's help__: Positive. The student automatically takes the 'LAB' or 'kata' closest to the ground.
- __Thor's help__: Positive. The student automatically takes the 3 'LABs' or 'katas' closest to the ground.
- __Extra life__: Positive. The student increases the number of their lives by 1.
- __Tiredness__: Negative. It makes the student move temporarily slower.
- __Hangover__: Negative. It causes the player's movement to be reversed temporarily, when the left key is pressed the player will go to the right and when the right key is pressed the player will go to the left.
- __Advance delivery date__: Negative. Increase the descent speed of the 'LABs' and 'katas' temporarily.

* * *

## MVP
### Technique
HTML5 __Canvas__, __¿DOM?__ and Vanilla __Javascript__

### Game states
* __Start Screen__
	
  * Title
  * Play button
  * ¿Setup?
    * Language: Spanish or English
    * Music: On/off
    * Sound effects: On/off
    * ¿Difficulty level?
      * Prework
      * Student
      * Ragnarök
     
     
* __Game Screen__

  * Canvas


* __Game Over Screen__

  * Play again button
  * Go to start screen button

### Game

* Create interface
* Create player
* Move player
  * Press the right and left keys to move the player horizontally.
* Create items that fall
* Check collision
  * If there is a collision with a 'LAB' or 'kata' and the ground, 'My failed deliveries' is modified
    * If 'My failed deliveries' > 'Failed deliveries allowed' --> Game Over --> Show Game Over screen
  * If there is a collision with a positive or negative item, the player's behaviour is modified

* * *

## BACK LOG

### Delivery Chart

* Shows:

  * The game phase
  * Number of exercises to deliver
  * Failed deliveries allowed
  * My failed deliveries

### Music
* Add background music to game
* Add music on and off button to setup
* Add sound effects on and off button to setup

### Levels
* Check phase and increase level

### Canvas frame?

* * *

## Data structure

__main.js__

````
createStartScreen(id);
createGameScreen(id);
createGameOverScreen(id);

destroyStartScreen();
destroyGameScreen();
destroyGameOverScreen();

var game = new Game({
    this.rows,
    this.columns,
    ctx: ctx,
    // backgroundcolor = ['xxx','xxx','xxx'],
    // backgroundimage = 'una imagen del fondo',
    this.deliveries,
    this.extraItemsFalling,
    this.player
  });

game.init();

````
__Game.js__

````
function Game(options){};
Game.drawBoard();
Game.drawPlayer();
Game.generateDeliveries();
Game.generateExtraItemsFalling();
Game.gameOver();
Game.init();

garbageCollector;
````

__Player.js__

````
function Player(){
  this.width;
  this.height;
  this.image;
  this.lifes
};
Player.move();
````


__Items_falling.js__

````
function Items_falling(){
  this.width;
  this.height;
  this.image
};
throwItem();
````

## Links

[Iron flip run Trello](https://trello.com/b/ykEf98Bd/project-module-1)

[Github](https://github.com/duducarmona/game-module-1)
