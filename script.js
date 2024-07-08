const FPS = 30; // Frames Per Second
const FRICTION = 0.7; // friction coefficient of space (0=no friction, 1=full friction)
const SHIP_SIZE = 30; // Ship size in pixels
const SHIP_THRUST = 5; // acceleration of the ship in pixels/second
const TURN_SPEED = 360; // Turn speed in degrees per second
/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

var ship = {
  // x and y is coordinates of ship
  x: canv.width / 2,
  y: canv.height / 2,
  // r is radius of ship
  r: SHIP_SIZE / 2,
  // Angle of the ship: Convert to Radians
  a: (90 / 180) * Math.PI,
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
};

// setup event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//setup game loop
setInterval(update, 1000 / FPS);

// Key down is when you are pressing the keyboard
function keyDown(/** @type {KeyboardEvent} */ e) {
  switch (e.keyCode) {
    case 37: // Left arrow (stop rotating left)
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38: // Up arrow (thrust the ship)
      ship.thrusting = true;
      break;
    case 39: // Right arrow (stop rotating right)
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 40: // Down arrow
      break;
  }
}

// Key up is when you are not pressing the keyboard
function keyUp(/** @type {KeyboardEvent} */ e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      ship.rot = 0;
      break;
    case 38: // Up arrow (stop thrusting)
      ship.thrusting = false;
      break;
    case 39: // Right arrow
      ship.rot = 0;
      break;
    case 40: // Down arrow
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
