/*
  Johan Karlsson, 2019
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
*/
let canvas;
let ctx;
let w, h;
let size;
let circles;


class Circle {
  constructor(r) {
    this.r = r;
    let nrOfPoints = 24;
    this.points = [];
    for (let circlePoint = 0; circlePoint < nrOfPoints; circlePoint++) {
      let angle = Math.PI * 2 / nrOfPoints * circlePoint;
      let x = Math.cos(angle) * r;
      let y = Math.sin(angle) * r;
      this.points.push(new Vector(x, y));
    }
  }

  move() {
    let deltaAngle = 0.05 * this.r / size;
    this.points.forEach(p => {
      // https://en.wikipedia.org/wiki/Rotation_matrix
      // 𝑥2=cos𝛽𝑥1−sin𝛽𝑦1
      // 𝑦2=sin𝛽𝑥1+cos𝛽𝑦1
      let x2 = Math.cos(deltaAngle) * p.x - Math.sin(deltaAngle) * p.y;
      let y2 = Math.sin(deltaAngle) * p.x + Math.cos(deltaAngle) * p.y;
      p.x = x2;
      p.y = y2;
    });
  }}


class Circles {
  constructor(nrOfCircles) {
    this.init(nrOfCircles);
  }

  init(nrOfCircles) {
    this.circles = new Array(nrOfCircles);
    let s = size / nrOfCircles * 0.45;
    for (let i = 0; i < nrOfCircles; i++) {
      let r = i * s + s;
      this.circles[i] = new Circle(r);
    }
  }

  move() {
    this.circles.forEach(c => c.move());
  }

  draw() {
    for (let circle = 0; circle < this.circles.length - 1; circle++) {
      let nrOfPoints = Math.min(this.circles[circle].points.length, this.circles[circle + 1].points.length);
      for (let i = 0; i < nrOfPoints; i++) {
        ctx.beginPath();
        ctx.moveTo(this.circles[circle].points[i].x, this.circles[circle].points[i].y);
        ctx.lineTo(this.circles[circle + 1].points[i].x, this.circles[circle + 1].points[i].y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.circles[circle].points[i].x, this.circles[circle].points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.circles[circle + 1].points[i].x, this.circles[circle + 1].points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }}


function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  window.addEventListener("resize", reset);
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  size = Math.min(w, h);
  ctx.translate(w / 2, h / 2);
  setupCircles();
}

function setupCircles() {
  circles = new Circles(5);
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(-w / 2, -h / 2, w, h);
  circles.draw();
  circles.move();
}

setup();
draw();