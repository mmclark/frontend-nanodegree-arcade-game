
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// From MDN
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// Determine if two objects intersect on the canvas.
// Each object is expected to have the following
// properties: x, y, width, height
function objectsIntersect(img1, img2) {

}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    var index = getRandomInt(1, 5);
    this.y = index * 80;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.name = "Joe";
    this.sprite = 'images/char-boy.png';
    this.x = 0;
    this.y = 0;
    this.width = undefined;
    this.height = undefined;
    this.img = undefined;
    this.moveX = 101;
    this.moveY = 83;


}

Player.prototype.update = function() {
    // Place the play initially at the bottom middle of the screen
    //var img = Resources.get(this.sprite);
    if (this.img == undefined) {
        this.img = Resources.get(this.sprite);
        this.width = this.img.width;
        this.height = this.img.height;
        this.returnToStart();
    }

    this.checkCollisions();
};


Player.prototype.render = function() {
    // var img = Resources.get(this.sprite);
    if (this.youwon) {
	ctx.fillStyle = "red";
	ctx.fillRect(100, 100, 100, 100);
    }
    ctx.drawImage(this.img, this.x, this.y);
};

Player.prototype.isOnBoard = function() {
    var playerImg = Resources.get(this.sprite);
    console.log("isOnBoard: x=" + this.x, ", y=" + this.y);

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

Player.prototype.atTheWater = function() {
    console.log("this.y = " + this.y);
    if (this.y < 80) {
	return true;
    }
    return false;
};

Player.prototype.returnToStart = function() {
    var playerImg = Resources.get(this.sprite);
    this.x = ctx.canvas.width / 2 - (playerImg.width / 2);
    this.y = 5 * 83;
};


Player.prototype.resetForAnotherRound = function(target) {
};

Player.prototype.youWonTheRound = function() {
    var title = document.getElementById("title");
    title.innerHTML = "You Won!";
    title.setAttribute("style", "color: red;");
    window.setTimeout(resetTitle, 2000);
};


Player.prototype.handleInput = function(keycode) {
    console.log("handleInput: x=" + this.x, ", y=" + this.y);

    if (this.atTheWater()) {
    	this.youWonTheRound();
    	return;
    }

    if (keycode == 'up') {
        this.y -= this.moveY;
    } else if (keycode == 'down') {
        this.y += this.moveY;
    } else if (keycode == 'left') {
        this.x -= this.moveX;
    } else if (keycode == 'right') {
        this.x += this.moveX;
    }

   if (!this.isOnBoard()) {
       this.returnToStart();
   } else if (this.atTheWater()) {
    	this.youWonTheRound();
   }


};


Player.prototype.checkCollisions = function() {
    for (var i=0; i < allEnemies.length; i++) {
        // If the x,y of the player is both (1) less than the right edge of the enemy (x+width)
        //
        var enemy = allEnemies[i];
        var enemyImg = Resources.get(enemy.sprite);
        var playerImg = Resources.get(this.sprite);
        if ((this.x >= enemy.x) && (this.x <= (enemy.x + 101))) {
            if ((this.y >= enemy.y) && (this.y <= (enemy.y + 83))) {
                // Collision!  Send the player back to the beginning
                this.returnToStart();
                // this.x = ctx.canvas.width / 2 - (playerImg.width / 2);
                // this.y = 5 * 83;
            }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = Array();
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

// Place the player object in a variable called player
var player = new Player();
//player.enemies = allEnemies;


function resetTitle() {
    var title = document.getElementById("title");
    title.innerHTML = "Play on...";
    title.setAttribute("style", "color: black;");
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
