/**
 *
 *
 */


var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;


/**
 * Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution! From
 * MDN
 *
 * @param {number} min  The min value of the random range. The return value will be greater or equal to this.
 * @param {number} max  The max value of the random range.  The return value will be less than this.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



/**
 * Enemies our player must avoid
 *
 * @constructor
 */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    var index = getRandomInt(1, 5);
    this.y = index * TILE_HEIGHT-3; // Keep the enemy firmly in it's tile

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};


/**
 * Update the enemy's position, required method for game
 *
 * @param {number} dt  A time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var speedIndex = getRandomInt(1, 10) * 100;
    this.x += (speedIndex * dt);
    if (this.x > ctx.canvas.width) {
        this.x = 0;
    }

};


/**
 * Draw the enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * Player class.  Represents the player on the screen.
 */
var Player = function() {
    this.name = "Joe";
    this.sprite = 'images/char-boy.png';
    this.x = 0;
    this.y = 0;
    this.width = undefined;
    this.height = undefined;
    this.img = undefined;
    this.moveX = TILE_WIDTH;
    this.moveY = TILE_HEIGHT;


};


/**
 * Update the location of the player on the game board.
 */
Player.prototype.update = function() {
    // Place the play initially at the bottom middle of the screen
    if (this.img == undefined) {
        this.img = Resources.get(this.sprite);
        this.width = this.img.width;
        this.height = this.img.height;
        this.returnToStart();
    }

    this.checkCollisions();
};


/**
 * Draw the player on the game board
 */
Player.prototype.render = function() {
    if (this.youwon) {
	ctx.fillStyle = "red";
	ctx.fillRect(100, 100, 100, 100); // TODO
    }
    ctx.drawImage(this.img, this.x, this.y);
};


/**
 * Determine if the player is still on the board.
 *
 * @return {boolean} true if the player is on the board, false if not
 */
Player.prototype.isOnBoard = function() {
    var playerImg = Resources.get(this.sprite);
    // console.log("isOnBoard: x=" + this.x, ", y=" + this.y);

    // Is the player off the top of the game board?
    if (this.y < 0) {
        return false;
    } else if (this.y > 415) {
        return false;
    } else if (this.x > 404) {
        return false;
    } else if (this.x < 0) {
        return false;
    }
    return true;
};


/**
 * Determine if the player has reached the water or not.
 *
 * @return {boolean} true if the player has reached the water, false if not
 */
Player.prototype.atTheWater = function() {
    if (this.y < TILE_HEIGHT) {
	return true;
    }
    return false;
};


/**
 * Return the player to the start of the game.
 */
Player.prototype.returnToStart = function() {
    var playerImg = Resources.get(this.sprite);
    this.x = ctx.canvas.width / 2 - (playerImg.width / 2);
    this.y = 5 * TILE_HEIGHT;
};


/**
 * Let the player know they've won the round by updating the
 * title at the top of the game board.
 */
Player.prototype.youWonTheRound = function() {
    var title = document.getElementById("title");
    title.innerHTML = "You Won!";
    title.setAttribute("style", "color: red;");

    // Set a timer to revert the title after a small period of time.
    window.setTimeout(resetGame, 2000);
};


/**
 * Handle player movement
 */
Player.prototype.handleInput = function(keycode) {
    // If the player has already reached the water
    // let them know.
    if (this.atTheWater()) {
    	this.youWonTheRound();
    	return;
    }

    // Handle the various movement keys by updating the
    // player's location
    if (keycode == 'up') {
        this.y -= this.moveY;
    } else if (keycode == 'down') {
        this.y += this.moveY;
    } else if (keycode == 'left') {
        this.x -= this.moveX;
    } else if (keycode == 'right') {
        this.x += this.moveX;
    }

    // Check if the player has moved off the screen or into the
    // the water (winner!) before the redraw begins.
    if (!this.isOnBoard()) {
	this.returnToStart();
    } else if (this.atTheWater()) {
    	this.youWonTheRound();
    }
};


/**
 * Check to see if any of the enemies have collided with the player.
 * If there's a collision, return the player to the start.
 */
Player.prototype.checkCollisions = function() {
    for (var i=0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        var enemyImg = Resources.get(enemy.sprite);
        var playerImg = Resources.get(this.sprite);

	// If the space occupied by the player intersects with the
	// space occupied by any of the enemies, then we have a collision!
	// If so, send the player back to the beginning.
        if ((this.x >= enemy.x) && (this.x <= (enemy.x + TILE_WIDTH))) {
            if ((this.y >= enemy.y) && (this.y <= (enemy.y + TILE_HEIGHT))) {
                this.returnToStart();
            }
        }
    }
};


/**
 * Recreate the enemies array for the game.
 *
 * @return {array} A array of enemy objects
 */
function createEnemies() {
    var enemiesArray = Array();
    enemiesArray.push(new Enemy());
    enemiesArray.push(new Enemy());
    enemiesArray.push(new Enemy());
    return enemiesArray;
}


// Place all enemy objects in an array called allEnemies
var allEnemies = createEnemies();

// Place the player object in a variable called player
var player = new Player();


/**
 * Reset the title and the game board, creating a new
 * set of enemies and moving the player back to the start.
 */
function resetGame() {
    var title = document.getElementById("title");
    title.innerHTML = "Play on...";
    title.setAttribute("style", "color: black;");
    allEnemies = createEnemies(); // reset the enemies array
    player.returnToStart();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
