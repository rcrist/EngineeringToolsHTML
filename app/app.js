// Access the canvas and its context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controlOut = document.getElementById('radius-output');
const control    = document.getElementById('radius');
      control.oninput = () => {
          controlOut.textContent = r = control.value;
      };
const mouse = { x: 0, y: 0 };

// Draw a filled blue rectangle on the canvas
const blueRect = function(x,y,width,height){
	ctx.fillStyle = 'blue';
	ctx.fillRect(x, y, width, height);
}

// Draw a red rectangle with no fill
// ctx.strokeStyle = "red";
// ctx.strokeRect(10,150,100,100);

// Draw a green rectangle using pathname
// ctx.beginPath();
// ctx.strokeStyle = 'green';
// ctx.moveTo(150,110); // First point
// ctx.lineTo(200,10);  // Second point - tip of triangle
// ctx.lineTo(250,110); // Third point
// ctx.lineTo(150,110); // Back to first point
// ctx.stroke();		 // Draw the path

// Draw a configurable arc
let r  = 100; // Radius
const p0 = { x: 0, y: 50 };

const p1 = { x: 100, y: 100 };
const p2 = { x: 150, y: 50 };
const p3 = { x: 200, y: 100 };

const labelPoint = function (p, offset, i = 0){
    const {x, y} = offset;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`${i}:(${p.x}, ${p.y})`, p.x + x, p.y + y);
}

const drawPoints = function (points){
  for (let i = 0; i < points.length; i++) {
    var p = points[i];
    labelPoint(p, { x: 0, y: -20 } , i)
  }
}

// Draw arc
const drawArc = function ([p0, p1, p2], r) {
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.arcTo(p1.x, p1.y, p2.x, p2.y, r);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

let t0 = 0;
let rr = 0; // the radius that changes over time
let a  = 0; // angle
let PI2 = Math.PI * 2;
const loop = function (t) {
  t0 = t / 1000;
  a  = t0 % PI2;
  rr = Math.abs(Math.cos(a) * r);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawArc([p1, p2, p3], rr);
  drawPoints([p1, p2, p3]);
  blueRect(200,200,100,100);
  requestAnimationFrame(loop);
}

loop(0);

// Clear the canvas using clearRect()
//ctx.clearRect(0,0,canvas.width, canvas.height);

// Clear the canvas using width
//window.canvas.width = window.canvas.width;