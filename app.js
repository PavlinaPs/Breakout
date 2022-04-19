// https://youtu.be/FyZ4_T0GZ1U
// Create a 2D Breakout Game Using JavaScript and HTML | PART 1 | JavaScript Project For Beginners
// Code Explained

const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

function drawRect(x, y) {
    ctx.fillStyle = "#ffff08";
    ctx.fillRect(x, y, 50, 50);
}

//draw rectangle, clear canvas
// drawRect(150, 200);
// ctx.clear(0, 0, cvs.width, cvs.height);
// drawRect(150, 250);

const bgImage = new Image();
bgImage.src = "./images/jakob-braun-NpeFMd8FseU-unsplash-background.jpg"

function loop() {
    // clear the canvas by draw image
    ctx.drawImage( bgImage , 0, 0);
    draw();     
    update();   // the logic
    requestAnimationFrame(loop);
}
loop();

const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 50;

const paddle = {
    x: cvs.width/2 - paddleWidth/2,
    y: cvs.height - paddleHeight - paddleMarginBottom,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5  // delta x
}

function drawPaddle(){
    ctx.fillStyle = "#ff4500"
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#2e3548";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

let leftArrow = false;
let rightArrow = false;

document.addEventListener("keydown", (e) => {
    if(e.code == 37) {
        leftArrow = true;
    } else if(e.code == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", (e) => {
    if(e.code == 37) {
        leftArrow = false;
    } else if(e.code == 39) {
        rightArrow = false;
    }
});

function movePaddle() {
    if(rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if(leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}


const ball = {
    x: cvs.width / 2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 3,
    dx: 3,
    dy: -3
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2); // 0 is starting angle
    ctx.fillStyle = "#9acd32";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y -= ball.dy;
}

let life = 3;

function ballWallCollision () {
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if(ball.y + ball.radius > cvs.height) {
        life--;
        resetBall();
    }
}

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 3 * (Math.random()* 2 - 1); //random number between 3 and -3
    ball.dy = -3;
}
//26:26
// paddle and ball collisions

function ballPaddleCollision(){
    if(ball.y > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.width) {
        // why is not accounted for the ball radius???
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        collidePoint = collidePoint / (paddle.width/2);
        let angle = collidePoint * (Math.PI/3);
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}
// cos(a) = ball.dy/ball.speed
// ball.dy = cos(a) * ball.speed
// sin(a) = ball.dx/ball.speed
// ball.dx = sin(a) * ball.speed

function draw() {
    drawPaddle();
    drawBall;
}

function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
}

// create bricks properties
const brick = {
    row: 3,
    column: 5,
    width: 55,
    height: 20,
    offsetLeft: 20,
    offsetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}

let bricks = [];
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: true // not broken
            }
        }
    }
}
createBricks();
// video 2, 10:52

// draw bricks
function drawBricks() {
    for(let r = 0; r < brick.row; r++) {
        for(let c = 0; c < brick.column; c++) {
            if(bricks[r][c].status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
}
drawBricks();

let score = 0;
let scoreUnit = 10;
// ball brick collisions
function ballBrickCollision() {
    for(let r = 0; r < brick.row; r++) {
        for(let c = 0; c < brick.column; c++) {
            let b = brick[r][c];
            if(b.status) {
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y - ball.radius < b.y + brick.height && ball.y + ball.radius > b.y ) {
                    b.status = false;
                    ball.dy = -ball.dy;
                    score += scoreUnit;
                }
            }
        }
    }
}
ballBrickCollision();

// show game stats


function showGameStats(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Arial";
    ctx.fillText(text, textX, textY);

    ctx.drawImage( img, imgX, imgY, 25, 25);
}

const scoreImg = new Image();
scoreImg.src = "./images/score.png";

const livesImg = new Image()
lifeImg.src = ".images/life.png";

const levelImg = new Image();
levelImg.src = ".images/level.png";
let level = 1;

showGameStats(score, 35, 25, scoreImg, 5, 5);
showGameStats(life, cvs.width - 25, 25, lifeImg, cvs.width - 55, 5);
showGameStats(level, cvs.width/2, 25, levelImg, cvs.width/2 - 30, 5);

// game over
let gameOverStatus = false;
function gameOver() {
    if(life <= 0) {
        gameOver = true;
    }
}

// inside loop function
if(!gameOver) {
    requestAnimationFrame(loop);
}

// level up
function levelUp(){
    let isLevelDone = true;
    const maxLevel = 3;
    for(let r = 0; r < brick.row; r++) {
        for(let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }
    if(isLevelDone) {
        if(level > maxLevel) {
            gameOver = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
    }
}

// sounds
const wallSound = new Audio();
wallSound.src = "./sounds/wall.mp3";

const brickHit = new Audio();
brickHit.src = "./sounds/brick_hit.mp3";

const lifeLost = new Audio();
lifeLost.src = "./sounds/live_lost.mp3";

const paddleHit = new Audio();
paddleHit.src = "./sounds/paddle_hit.mp3";

const win = new Audio();
win.src = "./sounds/win.mp3";

wallSound.play();
brickHit.play();
lifeLost.play();
paddleHit.play();
win.play();

wallSound.muted = true;

// part2 39:29