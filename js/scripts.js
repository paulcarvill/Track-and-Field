/**
 * LBi Track & Field JS
 * @version 1.0
 * @author Robert Greville - http://www.lbi.com/en
*/

/*
todo:

done 1. add hurdle images
done 2. add jump key
done 3. jump athlete on keypress
done 4. athlete only jumps if on the ground when key is pressed
done 5. add physics for athlete falling motion
done 6. add physics for athlete forward momentum
7. add collision detection for hurdles
done 8. add jump key for each athlete


*/

/* Variables
---------------------------------------*/

var canvas;  
var ctx;
var steps = 10;
var dt = 0.01;

var Player = function( x, y, imgSrc, altImgSrc ) {
    this.x = x;
    this.y = this.ground = y;
    this.jumpHeight = 16;
    this.halfPI = Math.PI / 2;
    this.jumpHangTime = 0.3;
    this.jumpSinWaveSpeed = this.halfPI / this.jumpHangTime;
    this.jumpSinWavePos = 0;
    this.fallMultiplyer = 4.5;
    this.imgSrc = imgSrc;
    this.altImgSrc = altImgSrc;
    this.img = new Image();
    this.img.src = imgSrc;
    this.isGrounded = true;
    this.moveForward = function() {
        this.x += steps;
    };
    this.displayImgSrc = function() {
        this.img.src = this.imgSrc;
    };
    this.displayAltImgSrc = function() {
        this.img.src = this.altImgSrc;
    };
};

Player.prototype.animate = function() {
    
    for ( var i = 0; i < this.hurdles.length; i++ ) {
        this.hurdles[i].draw()
    }
    
    var collision = false;

    do { // we always want to check for a collision at least once
        for (var i = 0; i < this.hurdles.length; i++) {
            if ( this.x > this.hurdles[i].x && this.x < this.hurdles[i].x + 30 && this.isGrounded ) {
                collision = true;
                this.x -= steps; // we are always moving right, so push the player left
            } else {
            collision = false;
            }
        }
    } while (collision);

    if ( !this.isGrounded ) { // if the player is jumping or falling, move along the sine wave
        var lastHeight = this.jumpSinWavePos; // the last position on the sine wave
        this.jumpSinWavePos += this.jumpSinWaveSpeed * dt; // the new position on the sine wave

        if (this.jumpSinWavePos >= Math.PI) { // we're off the bottom of the sine wave, so continue falling at predetermined speed
            this.y += this.jumpHeight / this.jumpHangTime * this.fallMultiplyer * dt;
        } else { // otherwise continue along the sine wave
            this.y -= (Math.sin(this.jumpSinWavePos) - Math.sin(lastHeight)) * this.jumpHeight;
        }
    }
    ctx.drawImage( this.img, this.x, this.y );
    
    if ( this.y >= this.ground ) { // we've hit the ground (our starting position), so stop falling
        this.isGrounded = true;
        this.jumpSinWavePos = 0;
    }
};

var Hurdle = function( x, y ) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = 'images/hurdle.gif';
    this.draw = function() {
        ctx.drawImage( this.img, x, y );
    }
}

var r1 = new Player(10, 80, 'images/runner1.png', 'images/runner1_2.png');
r1.hurdles = [ new Hurdle( 100, 84 ), new Hurdle( 250, 84 ), new Hurdle( 400, 84 ) ];
var r2 = new Player(10, 170, 'images/runner2.png', 'images/runner2_2.png');
r2.hurdles = [ new Hurdle( 100, 174 ), new Hurdle( 250, 174 ), new Hurdle( 400, 174 ) ];

var width = 600;
var height = 241;
var background = new Image();
var hurdle = new Image();
var finished = false;
var player1name = prompt('Player 1 - Enter your name');
var player2name = prompt('Player 2 - Enter your name');
var player1name = '1';
var player2name = '2';

var key1 = false;
var key2 = false;
var key3 = false;
var key4 = false;
var r1jump = false;
var r2jump = false;
var timer = setTimeout(onTimeout, 4000);
var framenumber = 0;
var countdown = 4;

/* Images/imports
---------------------------------------*/

background.src = 'images/bg.gif';

/* Functions
---------------------------------------*/

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	return setInterval(draw, 10);
}

if(window.G_vmlCanvasManager){
	document.getElementById('canvas');
	ctc = canvas.getContext(canvas);
}

function rect(x,y,w,h) {
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function clearCanvas() {
	ctx.clearRect(0, 0, width, height);
}

function doKeyDown(evt){
	 // player 1 keys
	if (evt.keyCode === 90) {
		r1.displayImgSrc();
		if(key1){
			key1 = key2 = false;
		}
		key1 = true;
	}
	if (evt.keyCode === 88) {
		r1.displayAltImgSrc();
		key2 = true;
	}
	if(key1 && key2){
		//move the guy
		if (r1.x + steps < width) {
			r1.moveForward();
		}
		key1 = key2 = false;
	}
	if (evt.keyCode === 65 && r1.isGrounded) { // 'a' key
	    r1.y-=40; // make the athlete jump.
	    r1.isGrounded = false;
	}
	
	// player 2 keys
	if (evt.keyCode === 78) {
		r2.displayImgSrc();
		if(key3){
			key3 = key4 = false;
		}
		key3 = true;
	}
	if (evt.keyCode === 77) {
		r2.displayAltImgSrc();
		key4 = true;
	}
	if(key3 && key4){
		//move the guy
		if (r2.x + steps < width) {
			r2.moveForward();
		}
		key3 = key4 = false;
	}
	if (evt.keyCode === 75 && r2.isGrounded) { // 'k' key
	    r2.y-=40; // make the athlete jump.
	    r2.isGrounded = false;
	}
}

function names() {
	ctx.font = "bold 20px sans-serif";
	ctx.fillText(player1name, 35, 135);
	ctx.font = "bold 20px sans-serif";
	ctx.fillText(player2name, 35, 225);
}


function draw() {
	clearCanvas();
	rect(0,0,width,height);
	ctx.drawImage(background,0,0);
	names();
	framenumber++;
	if (framenumber%100 === 0 && countdown){
		countdown--;
	}
	if (countdown >= 2){
		ctx.font = "bold 40px sans-serif";
		ctx.fillText(countdown-1, width / 2, 50);
		ctx.textAlign = "center";
	}
	if (countdown === 1){
		ctx.font = "bold 40px sans-serif";
		ctx.fillText("GO", width / 2, 50);
		ctx.textAlign = "center";
	}
	r1.animate();
	r2.animate();
	
	if (r1.x >= 566) {
		finished = true;
		document.getElementById('audio1').pause();
		ctx.clearRect(0, 0, width, height);
		rect(0,0,width,height);
		ctx.drawImage(background,0,0);
		ctx.drawImage(r1.img, r1.x, r1.y);
		ctx.drawImage(r2.img, r2.x, r2.y);
		ctx.font = "bold 20px sans-serif";
		ctx.fillText("The Winner is " + player1name, width / 2, 135);
		ctx.textAlign = "center";
	}
	if (r2.x >= 566) {
		finished = true;
		document.getElementById('audio1').pause();
		ctx.clearRect(0, 0, width, height);
		rect(0,0,width,height);
		ctx.drawImage(background,0,0);
		ctx.drawImage(r1.img, r1.x, r1.y);
		ctx.drawImage(r2.img, r2.x, r2.y);
		ctx.font = "bold 20px sans-serif";
		ctx.fillText("The Winner is " + player2name, width / 2, 135);
		ctx.textAlign = "center";
	}
}

/* Initilisation
---------------------------------------*/

window.focus();

document.getElementById('audio1').play();

init();

function onTimeout() {
	window.addEventListener('keydown',doKeyDown,true);
}

document.getElementById('audio1').addEventListener('ended', function(){
	this.currentTime = 0;
}, false);