import kaboom from 'kaboom';

// Start game
kaboom();
loadRoot('https://raw.githubusercontent.com/replit/kaboom/f6443b9de1fd15aa2bc5125fd20873b349b72f8d/assets/');
// Load assets
loadSprite('bean', '/sprites/bean.png');
loadSprite('coin', '/sprites/coin.png');
loadSprite('spike', '/sprites/spike.png');
loadSprite('grass', '/sprites/grass.png');
loadSprite('ghosty', '/sprites/ghosty.png');
loadSprite('portal', '/sprites/portal.png');
loadSound('score', '/sounds/score.mp3');
loadSound('portal', '/sounds/portal.mp3');

const SPEED = 480;

// Design 2 levels
const LEVELS = [
  [
    '@   $$$  ^     >',
    '=   ========   =',
  ],
  [
    '@  ^ $$ >',
    '=========',
  ],
  [
    '@   $   >',
    '=   =   =',
  ],
];

scene('game', ({levelIdx, score}) => {
  gravity(2400);

  const level = addLevel(LEVELS[levelIdx || 0], {
    'width': 64,
    'height': 64,
    'pos': vec2(100, 200),
    '@': () => [
      sprite('bean'),
      area(),
      body(),
      origin('bot'),
      'player',
    ],
    '=': () => [
      sprite('grass'),
      area(),
      solid(),
      origin('bot'),
    ],
    '$': () => [
      sprite('coin'),
      area(),
      origin('bot'),
      'coin',
    ],
    '^': () => [
      sprite('spike'),
      area(),
      origin('bot'),
      'danger',
    ],
    '>': () => [
      sprite('portal'),
      area(),
      origin('bot'),
      'portal',
    ],
  });

  // Get the player object from tag
  const player = get('player')[0];

  // Movements
  onKeyPress('space', () => {
    if (player.isGrounded()) {
      player.jump();
    }
  });

  onKeyDown('left', () => {
    player.move(-SPEED, 0);
  });

  onKeyDown('right', () => {
    player.move(SPEED, 0);
  });

  player.onCollide('danger', () => {
    player.pos = level.getPos(0, 0);
    go('lose');
  });

  player.onCollide('coin', (coin) => {
    destroy(coin);
    play('score');
    score++;
    scoreLabel.text = score;
  });

  // Fall death
  player.onUpdate(() => {
    if (player.pos.y >= 480) {
      go('lose');
    }
  });

  // Enter the next level on portal
  player.onCollide('portal', () => {
    play('portal');
    if (levelIdx < LEVELS.length - 1) {
      // If there's a next level, go() to the same scene but load the next level
      go('game', {
        levelIdx: levelIdx + 1,
        score: score,
      });
    } else {
      // Otherwise we have reached the end of game, go to 'win' scene!
      go('win', {score: score});
    }
  });

  // Score counter text
  const scoreLabel = add([
    text(score),
    pos(12),
  ]);
});

scene('lose', () => {
  add([
    text('Perdiste'),
    pos(12),
  ]);

  onKeyPress(start);
});

scene('win', ({score}) => {
  add([
    text(`You grabbed ${score} coins!!!`, {
      width: width(),
    }),
    pos(12),
  ]);
  onKeyPress(start);
});


/**
 * Start the game
 */
function start() {
  // Start with the 'game' scene, with initial parameters
  go('game', {
    levelIdx: 0,
    score: 0,
  });
}

start();
