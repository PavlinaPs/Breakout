var lockboard = false;

restart.addEventListener('click', function() {
    gameover.style.display = "none";
    youwon.style.display = "none";
    if(!lockboard) {   
    // location.reload(); // reload the page
    lockboard = true;
    playGame();
    }
});

function playGame() {
    // select canvas element
    const cvs = document.getElementById("breakout");
    const ctx = cvs.getContext("2d");

    // add border to canvas
    cvs.style.border = "1px solid red";

    // line thickness
    ctx.lineWidth = 3;

    //variables and constants
    const paddleWidth = 100;
    const paddleHeight = 20;
    const paddleMarginBottom = 50;
    const ballRadius = 8;
    let leftArrow = false;
    let rightArrow = false;
    let life = 3;
    let score = 0;
    const scoreUnit = 10;
    let level = 1;
    const maxLevel = 3;
    let gameOverStatus = false;

    //create paddle
    const paddle = {
        x: cvs.width/2 - paddleWidth/2,
        y: cvs.height - paddleHeight - paddleMarginBottom,
        width: paddleWidth,
        height: paddleHeight,
        dx: 5  // delta x
    }

    // draw paddle
    function drawPaddle(){
        ctx.fillStyle = "#ff4500"
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        ctx.strokeStyle = "#fff";
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // control the paddle
    document.addEventListener("keydown", (e) => {
        if(e.code == "ArrowLeft") {
            leftArrow = true;
        } else if(e.code == "ArrowRight") {
            rightArrow = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        if(e.code == "ArrowLeft") {
            leftArrow = false;
        } else if(e.code == "ArrowRight") {
            rightArrow = false;
        }
    });

    // move paddle
    function movePaddle() {
        if(rightArrow && paddle.x + paddle.width < cvs.width) {
            paddle.x += paddle.dx;
        } else if(leftArrow && paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    }

    // create ball
    const ball = {
        x: cvs.width / 2,
        y: paddle.y - ballRadius,
        radius: ballRadius,
        speed: 4,
        dx: 3 * (Math.random()* 2 - 1), //random number between 3 and -3
        dy: -3
    }

    // draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2); // 0 is starting angle
        ctx.fillStyle = "#9acd32";
        ctx.fill();

        ctx.strokeStyle = "#9acd32";
        ctx.stroke();
        ctx.closePath();
    }

    // move ball
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
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

    // draw bricks
    function drawBricks() {
        for(let r = 0; r < brick.row; r++) {
            for(let c = 0; c < brick.column; c++) {
                let b = bricks[r][c];
                if(b.status) {
                    ctx.fillStyle = brick.fillColor;
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);

                    ctx.strokeStyle = brick.strokeColor;
                    ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                }
            }
        }
    }
    drawBricks();

    // ball brick collisions
    function ballBrickCollision() {
        for(let r = 0; r < brick.row; r++) {
            for(let c = 0; c < brick.column; c++) {
                let b = bricks[r][c];
                if(b.status) {
                    if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y - ball.radius < b.y + brick.height && ball.y + ball.radius > b.y ) {
                        brickHit.play();
                        b.status = false;
                        ball.dy = -ball.dy;
                        score += scoreUnit;
                    }
                }
            }
        }
    }

    // show game stats
    function showGameStats(text, textX, textY, img, imgX, imgY) {
        ctx.fillStyle = "#FFF";
        ctx.font = "25px Arial";
        ctx.fillText(text, textX, textY);

        ctx.drawImage( img, imgX, imgY, width = 25, height = 25);
    }

    // draw function
    function draw() {
        drawPaddle();
        drawBall();
        drawBricks()

        // show score
        showGameStats(score, 35, 25, scoreImg, 5, 5);

        // show lives
        showGameStats(life, cvs.width - 25, 25, livesImg, cvs.width - 55, 5);

        // show level
        showGameStats(level, cvs.width/2, 25, levelImg, cvs.width/2 - 30, 5);
    }
    // game over
    function gameOver() {
        if(life <= 0) {
            showYouLose()
            gameOverStatus = true;
            lockboard = false;
        }
    }

    // level up
    function levelUp(){
        let isLevelDone = true;
        for(let r = 0; r < brick.row; r++) {
            for(let c = 0; c < brick.column; c++) {
                isLevelDone = isLevelDone && !bricks[r][c].status;
            }
        }
        if(isLevelDone) {
            win.play();
            if(level >= maxLevel) {
                showYouWin();
                gameOverStatus = true;
                lockboard = false;
                return;
            }
            brick.row++;
            createBricks();
            ball.speed += 0.5;
            resetBall();
            level++;
        }
    }

    // wall collisions
    function ballWallCollision () {
        if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            wallSound.play();
        }
        if(ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
            wallSound.play();
        }
        if(ball.y + ball.radius > cvs.height) {
            life--;
            lifeLost.play();
            resetBall();
        }
    }

    // reset ball
    function resetBall() {
        ball.x = cvs.width/2;
        ball.y = paddle.y - ball.radius;
        ball.dx = 3 * (Math.random()* 2 - 1); //random number between 3 and -3
        ball.dy = -3;
    }

    // ball and paddle collisions
    function ballPaddleCollision(){
        if(ball.y > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            paddleHit.play();
            // why is not accounted for the ball radius???
            //check where the ball hit the paddle
            let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            // normalize values
            collidePoint = collidePoint / (paddle.width/2);
            // calculate the angle of the ball, max is 60deg
            let angle = collidePoint * (Math.PI/3);
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = - ball.speed * Math.cos(angle);
        }
    }
        // cos(a) = ball.dy/ball.speed
        // ball.dy = cos(a) * ball.speed
        // sin(a) = ball.dx/ball.speed
        // ball.dx = sin(a) * ball.speed

    //update function
    function update() {
        movePaddle();
        moveBall();
        ballWallCollision();
        ballPaddleCollision();
        ballBrickCollision();
        gameOver();
        levelUp();
    }

    // game loop
    function loop() {
        // clear the canvas by draw image
        ctx.drawImage(bgImage, 0, 0);
        draw();     
        update();   // the logic
        if(!gameOverStatus) {
            requestAnimationFrame(loop);
        }
    }
    loop()

    //select sound element
    const soundElement = document.getElementById('sound');

    soundElement.addEventListener('click', audioManager);

    function audioManager() {
        //change image sound on/off
        let imgSrc = soundElement.getAttribute('src');
        let soundImg = imgSrc == "./images/SOUND_ON.png" ? "./images/SOUND_OFF.png" : "./images/SOUND_ON.png";

        soundElement.setAttribute('src', soundImg);

        //mute and unmute sounds
        wallSound.muted = wallSound.muted ? false : true;
        brickHit.muted = brickHit.muted ? false : true;
        lifeLost.muted = lifeLost.muted ? false : true;
        paddleHit.muted = paddleHit.muted ? false : true;
        win.muted = win.muted ? false : true;
    }

    // show game over message
    const gameover = document.getElementById('gameover');
    const youwon = document.getElementById('youwon');
    const youlose = document.getElementById('youlose');
    const restart = document.getElementById('restart');

    // show you win
    function showYouWin() {
        gameover.style.display = "block";
        youwon.style.display = "block";
    }

    function showYouLose() {
        gameover.style.display = "block";
        youlose.style.display = "block";
    }
}


