// FPS: Frames Per Second
// FRICITON: friction coefficient of space (0=no friction, 1=full friction)
// SHIP_SIZE: Ship size in pixels
// SHIP_THRUST: acceleration of the ship in pixels/second
// TURN_SPEED: Turn speed in degrees/second
// ASTEROID_NUM: Starting number of asteroids
// ASTEROID_SPEED: Max starting speed of asteroids in pixels/second
// ASTEROID_SIZE: Starting size of asteroids in pixels
// ASTEROID_VERT: Average number of vertices/asteroid
const FPS = 30;
const FRICTION = 0.7;
const SHIP_SIZE = 30;
const SHIP_THRUST = 5;
const TURN_SPEED = 360;
const ASTEROID_NUM = 3;
const ASTEROID_SPEED = 50;
const ASTEROID_SIZE = 100;
const ASTEROID_VERT = 10;
/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

/**
 * ship: Represents a spaceship.
 * @typedef {Object} Ship
 * @property {number} x - The x-coordinate of the ship.
 * @property {number} y - The y-coordinate of the ship.
 * @property {number} r - The radius of the ship.
 * @property {number} a - The angle (in radians) of the ship's orientation.
 * @property {number} rot - The rotational speed of the ship.
 * @property {boolean} thrusting - Indicates whether the ship is currently thrusting.
 * @property {Object} thrust - The thrust force applied to the ship.
 * @property {number} thrust.x - The x-component of the thrust force.
 * @property {number} thrust.y - The y-component of the thrust force.
 */
var ship = {
  x: canv.width / 2,
  y: canv.height / 2,
  r: SHIP_SIZE / 2,
  a: (90 / 180) * Math.PI,
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
};

// Create Asteroids
var asteroids = [];
createAsteroidBelt();

// Setup Event Handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Game Loop
setInterval(update, 1000 / FPS);

/**
 * createAsteroidBelt(): Creates a belt of asteroids with random positions.
 *
 * Generates a specified number of asteroids with random positions within
 * the canvas dimensions and stores them in the `asteroids` array.
 *
 * @function createAsteroidBelt
 */
function createAsteroidBelt() {
  asteroids = [];
  var x, y;

  for (var i = 0; i < ASTEROID_NUM; i++) {
    x = Math.floor(Math.random() * canv.width);
    y = Math.floor(Math.random() * canv.height);
    asteroids.push(createNewAsteroid(x, y));
  }
}

/**
 * Creates a new asteroid with random position, velocity, and angle.
 *
 * The asteroid's position is determined by the provided coordinates.
 * Its velocity is randomly generated within the range defined by ASTEROID_SPEED.
 * The angle is randomly set between 0 and 2π radians.
 *
 * @param {number} x - The x-coordinate for the new asteroid.
 * @param {number} y - The y-coordinate for the new asteroid.
 * @returns {Object} An asteroid object with properties: x, y, xv, yv, r, and a.
 * @property {number} x - The x-coordinate of the asteroid.
 * @property {number} y - The y-coordinate of the asteroid.
 * @property {number} xv - The velocity of the asteroid in the x direction.
 * @property {number} yv - The velocity of the asteroid in the y direction.
 * @property {number} r - The radius of the asteroid.
 * @property {number} a - The angle (in radians) of the asteroid's orientation.
 */
function createNewAsteroid(x, y) {
  var asteroid = {
    x: x,
    y: y,
    xv:
      ((Math.random() * ASTEROID_SPEED) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    yv:
      ((Math.random() * ASTEROID_SPEED) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    r: ASTEROID_SIZE / 2,
    a: Math.random() * Math.PI * 2, // in radians
    vert: Math.floor(Math.random() * (ASTEROID_VERT + 1) + ASTEROID_VERT / 2),
  };
  return asteroid;
}

/**
 * keyDown: Handles keydown events to control the ship's movement.
 *
 * This function is triggered when a key is pressed. It checks the key code and updates
 * the ship's rotation or thrusting state based on the key pressed:
 * - Left arrow key (keyCode 37): Starts rotating the ship to the left.
 * - Up arrow key (keyCode 38): Starts thrusting the ship forward.
 * - Right arrow key (keyCode 39): Starts rotating the ship to the right.
 * - Down arrow key (keyCode 40): No action assigned.
 *
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function keyDown(/** @type {KeyboardEvent} */ e) {
  switch (e.keyCode) {
    case 37:
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38:
      ship.thrusting = true;
      break;
    case 39:
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 40:
      break;
  }
}

/**
 * keyUp: Handles keyup events to stop ship actions.
 *
 * This function is triggered when a key is released. It checks the key code
 * and stops the corresponding ship action:
 * - Left arrow key (keyCode 37): Stops rotating the ship left.
 * - Up arrow key (keyCode 38): Stops thrusting the ship forward.
 * - Right arrow key (keyCode 39): Stops rotating the ship right.
 * - Down arrow key (keyCode 40): No action assigned.
 *
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function keyUp(/** @type {KeyboardEvent} */ e) {
  switch (e.keyCode) {
    case 37:
      ship.rot = 0;
      break;
    case 38:
      ship.thrusting = false;
      break;
    case 39:
      ship.rot = 0;
      break;
    case 40:
      break;
  }
}

function update() {
  // Draw background: space
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);
  // thrust the ship
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;
    // Draw the thruster
    ctx.fillStyle = "red";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();
    ctx.moveTo(
      // Rear left of the ship
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    );
    ctx.lineTo(
      // Rear center (behind the ship)
      ship.x - ship.r * ((6 / 3) * Math.cos(ship.a)),
      ship.y + ship.r * ((6 / 3) * Math.sin(ship.a))
    );
    ctx.lineTo(
      // Rear Right: drawing the bottom of the triangle
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    );
    ctx.closePath(); // Finishing the triangle off
    ctx.fill();
    ctx.stroke();
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }
  // Draw ship: Triangular ship
  ctx.strokeStyle = "white";
  ctx.lineWidth = SHIP_SIZE / 10;
  ctx.beginPath();
  ctx.moveTo(
    // Nose of the ship
    ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
    ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
  );
  ctx.lineTo(
    // Rear Left: drawing left side of the triangle
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
  );
  ctx.lineTo(
    // Rear Right: drawing the bottom of the triangle
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
  );
  ctx.closePath(); // Finishing the triangle off
  ctx.stroke();

  // Draw the asteroids
  ctx.stokeStyle = "slategrey";
  ctx.lineWidth = SHIP_SIZE / 20;
  var x, y, r, a, vert;
  for (var i = 0; i < asteroids.length; i++) {
    // get asteroid properties
    x = asteroids[i].x;
    y = asteroids[i].y;
    r = asteroids[i].r;
    a = asteroids[i].a;
    vert = asteroids[i].vert;
    // Draw a path
    ctx.beginPath();
    ctx.moveTo(
      // Move to the beginning of the line
      x + r * Math.cos(a),
      y + r * Math.sin(a)
    );

    // Draw the shape of the asteroid: polygon
    for (var j = 0; j < vert; j++) {
      ctx.lineTo(
        x + r * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    ctx.closePath();
    ctx.stroke();

    // Move the asteroid

    // Handle edge of screen: wrap around
  }
  // Rotate ship
  ship.a += ship.rot;
  // Move the ship
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;
  // handle edge of screen (wrap around)
  if (ship.x < 0 - ship.r) {
    ship.x = canv.width + ship.r;
  } else if (ship.x > canv.width + ship.r) {
    ship.x = 0 - ship.r;
  }

  if (ship.y < 0 - ship.r) {
    ship.y = canv.height + ship.r;
  } else if (ship.y > canv.height + ship.r) {
    ship.y = 0 - ship.r;
  }

  // Centre dot
  ctx.fillStyle = "red";
  ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
