// load background image
const bgImage = new Image();
bgImage.src = "./images/jakob-braun-NpeFMd8FseU-unsplash-background.jpg";

const scoreImg = new Image();
scoreImg.src = "./images/score.svg";

const livesImg = new Image()
livesImg.src = "./images/lives.svg";

const levelImg = new Image();
levelImg.src = "./images/levels.svg";

// load sounds
const wallSound = new Audio();
wallSound.src = "./sounds/wall.mp3";

const brickHit = new Audio();
brickHit.src = "./sounds/brick_hit.mp3";

const lifeLost = new Audio();
lifeLost.src = "./sounds/life_lost.mp3";

const paddleHit = new Audio();
paddleHit.src = "./sounds/paddle_hit.mp3";

const win = new Audio();
win.src = "./sounds/win.mp3";