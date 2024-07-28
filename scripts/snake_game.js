const canvas = document.querySelector('#canvas');
const scoreV = document.querySelector('.score');
const speedInput = document.querySelector('#speed');
const crashDiv = document.querySelector('.crashed');
const c = canvas.getContext('2d');

// window.location.reload();

// Control panel
const cDis = 20;
const ballColor = 'red';
const snakeColor = 'orange';
let ballTimer = 2666;
let snakeTimer = 50;
const snakeStep = 5;
// Dependent
const moveLimit = cDis / snakeStep;

// Key Direction define
const up = 'ArrowUp';
const down = 'ArrowDown';
const right = 'ArrowRight';
const left = 'ArrowLeft';

// Initial Values
let play = true;
let sxp = -10;
let syp = 250;
let balls = [];
let snake = [];
let snakeHead = {};
let snakeBody = [];
let snakeTail = {};
let snakeLength = 20;
let score = 0;

// Control Values
let moveCount = cDis / snakeStep;
let dir = 'ArrowRight';
let cmdX = 'inc';
let cmdY = 'eq';

// Crash
let isCrashed = false;

// Ball Interval
let ballInterval = setInterval(() => {
  play && handleBS('ball');
}, ballTimer);

// Snake Interval
let snakeInterval = setInterval(() => {
  play && (moveCount < moveLimit ? moveCount++ : moveCount, handleBS('snake'));
}, snakeTimer);

// Snake Speed
speedInput.addEventListener('change', () => {
  let speedV = speedInput.value;

  speedV == 'low' && ((snakeTimer = 300), (ballTimer = 4000));
  speedV == 'normal' && ((snakeTimer = 200), (ballTimer = 2666));
  speedV == 'high' && ((snakeTimer = 100), (ballTimer = 1333));

  clearInterval(ballInterval);
  clearInterval(snakeInterval);

  ballInterval = setInterval(() => {
    play && handleBS('ball');
  }, ballTimer);

  snakeInterval = setInterval(() => {
    play &&
      (moveCount < moveLimit ? moveCount++ : moveCount, handleBS('snake'));
  }, snakeTimer);
});

// Game Switch
canvas.addEventListener('click', () => {
  play = !play;
});
crashDiv.addEventListener('click', () => {
  isCrashed ? document.location.reload() : (play = !play);
});

// Snake Direction Switch
document.addEventListener('keydown', k => {
  const kDir = k.key;
  const keyRes = () => {
    dir = kDir;
    handleDir();
    moveCount = 0;
  };

  if (
    // handle Right & Left
    (play && (dir == right || dir == left) && (kDir == up || kDir == down)) ||
    ((dir == up || dir == down) && (kDir == right || kDir == left))
  ) {
    moveCount == moveLimit
      ? keyRes()
      : setTimeout(() => {
          keyRes();
        }, (moveLimit - moveCount) * snakeTimer);
  } else if (kDir == ' ' || kDir == 'p') {
    isCrashed ? document.location.reload() : (play = !play);
  } else {
    dir;
  }
});
const handleDir = () => {
  if (dir == right) {
    cmdX = 'inc';
    cmdY = 'eq';
  } else if (dir == left) {
    cmdX = 'dec';
    cmdY = 'eq';
  } else if (dir == up) {
    cmdX = 'eq';
    cmdY = 'dec';
  } else if (dir == down) {
    cmdX = 'eq';
    cmdY = 'inc';
  } else {
    cmdX;
    cmdY;
  }
};

// Handle Balls & Snake
const handleBS = bs => {
  if (bs === 'ball') {
    balls.push(randomPosition());
  } else if (bs === 'snake') {
    const x = sXIncDec(cmdX);
    const y = sYIncDec(cmdY);
    snakeBody.map(sb => {
      if (
        sb.x < x + cDis &&
        sb.x > x - cDis &&
        sb.y < y + cDis &&
        sb.y > y - cDis
      ) {
        play = false;
        isCrashed = true;
        crashDiv.classList.remove('hidden');
      }
    });

    play &&
      (snake.push({ x, y, dir }),
      (snakeHead = { x, y, dir }),
      // Snake Length
      snake.length > snakeLength ? snakeL(snake) : snake);
  }

  const hx = snakeHead.x;
  const hy = snakeHead.y;

  c.reset();
  drawTail();
  balls.map(b => {
    b.x < hx + cDis &&
      b.x > hx - cDis &&
      b.y < hy + cDis &&
      b.y > hy - cDis &&
      handleEat(hx, hy);
    // Call Ball Drawing
    drawBalls(b.x, b.y, ballColor);
  });

  // Call Snake Drawing
  snake.map(s => {
    drawSnake(s.x, s.y, snakeColor);
  });
  drawHead(snakeHead.x, snakeHead.y, snakeHead.dir);
};

// b.x < hx + cDis && b.x > hx - cDis && b.y < hy + cDis && b.y > hy - cDis
const handleEat = (hx, hy) => {
  const newBalls = balls.filter(
    b =>
      !(
        b.x < hx + cDis &&
        b.x > hx - cDis &&
        b.y < hy + cDis &&
        b.y > hy - cDis
      )
  );
  balls = newBalls;

  snakeLength = snakeLength + cDis / snakeStep;
  score++;

  scoreV.textContent = 'Score : ' + score;
};

const snakeL = s => {
  let newSnake = [];
  let newSnakeBody = [];

  for (let i = s.length - snakeLength; i <= s.length - 1; i++) {
    newSnake.push(snake[i]);
    !(i >= s.length - (cDis / snakeStep) * 2 && i >= 2) &&
      newSnakeBody.push(snake[i]);
  }

  snake = newSnake;
  snakeBody = newSnakeBody;
  snakeTail = snakeBody[0];
};

// Basic Functions starts

// **Random Position
const randomPosition = () => {
  const x = (Math.random() * 39).toFixed() * cDis + 10;
  const y = (Math.random() * 24).toFixed() * cDis + 10;

  const position = { x, y };
  return position;
};

// Snake X Inc & Dec
const sXIncDec = cmd => {
  cmd === 'inc'
    ? sxp < 790
      ? (sxp = sxp + snakeStep)
      : (sxp = 10)
    : cmd === 'dec'
    ? sxp > 10
      ? (sxp = sxp - snakeStep)
      : (sxp = 790)
    : (sxp = sxp);

  return sxp;
};
// Snake Y Inc & Dec
const sYIncDec = cmd => {
  cmd === 'inc'
    ? syp < 490
      ? (syp = syp + snakeStep)
      : (syp = 10)
    : cmd === 'dec'
    ? syp > 10
      ? (syp = syp - snakeStep)
      : (syp = 490)
    : (syp = syp);

  return syp;
};

// **Drawing
const drawBalls = (x, y, color) => {
  c.beginPath();
  c.arc(x, y, 10, 0, 2 * Math.PI);
  c.fillStyle = color;
  c.fill();
};

const drawTail = () => {
  const { x, y, dir } = snakeTail;

  tailDraw(x, y, dir, snakeColor, 'fill');
  // tailDraw(x, y, dir, 'green', 'stroke');
};

const tailDraw = (x, y, dir, color, type) => {
  c.beginPath();
  (dir == right || dir == left) &&
    (c.moveTo(x, y + 12.5),
    c.lineTo(dir == right ? x - 28 : x + 28, y + 2),
    c.lineTo(dir == right ? x - 30 : x + 30, y),
    c.lineTo(dir == right ? x - 28 : x + 28, y - 2),
    c.lineTo(x, y - 12.5));

  (dir == up || dir == down) &&
    (c.moveTo(x + 12.5, y),
    c.lineTo(x + 2, dir == up ? y + 28 : y - 28),
    c.lineTo(x, dir == up ? y + 30 : y - 30),
    c.lineTo(x - 2, dir == up ? y + 28 : y - 28),
    c.lineTo(x - 12.5, y));

  type == 'stroke' &&
    ((c.lineWidth = '3'), (c.strokeStyle = color), c.stroke());
  type == 'fill' && ((c.fillStyle = color), c.fill());
};

const drawSnake = (x, y, color) => {
  c.beginPath();
  c.arc(x, y, 11, 0, 2 * Math.PI);
  c.fillStyle = color;
  c.fill();

  // c.beginPath();
  // c.arc(x, y, 12.5, 0, 2 * Math.PI);
  // c.lineWidth = '3';
  // c.strokeStyle = 'green';
  // c.stroke();
};

const drawHead = (x, y, d) => {
  (d == right || d == left) &&
    (drawEyes(x, y + 10, 6, 'white', 'fill'),
    drawEyes(x, y - 10, 6, 'white', 'fill'),
    drawEyes(x, y + 10, 7, 'black', 'stroke'),
    drawEyes(x, y - 10, 7, 'black', 'stroke'));

  (d == up || d == down) &&
    (drawEyes(x + 10, y, 6, 'white', 'fill'),
    drawEyes(x - 10, y, 6, 'white', 'fill'),
    drawEyes(x + 10, y, 7, 'black', 'stroke'),
    drawEyes(x - 10, y, 7, 'black', 'stroke'));

  d == right &&
    (drawEyes(x + 3, y + 10, 3, 'black', 'fill'),
    drawEyes(x + 3, y - 10, 3, 'black', 'fill'));

  d == left &&
    (drawEyes(x - 3, y + 10, 3, 'black', 'fill'),
    drawEyes(x - 3, y - 10, 3, 'black', 'fill'));

  d == up &&
    (drawEyes(x + 10, y - 3, 3, 'black', 'fill'),
    drawEyes(x - 10, y - 3, 3, 'black', 'fill'));

  d == down &&
    (drawEyes(x + 10, y + 3, 3, 'black', 'fill'),
    drawEyes(x - 10, y + 3, 3, 'black', 'fill'));
};

const drawEyes = (x, y, r, color, type) => {
  // c.translate(0, -10);
  type == 'fill' &&
    (c.beginPath(),
    c.arc(x, y, r, 0, 2 * Math.PI),
    (c.fillStyle = color),
    c.fill());

  type == 'stroke' &&
    (c.beginPath(),
    c.arc(x, y, r, 0, 2 * Math.PI),
    (c.lineWidth = '2'),
    (c.strokeStyle = color),
    c.stroke());
};
// Basic Functions ends
