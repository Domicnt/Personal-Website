//set up canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight / 3;
context.canvas.width = width;
context.canvas.height = height;

class Star {
    constructor() {
        this.x = (Math.random() * width / 2) * (Math.random() >= .5 ? 1 : 2);
        this.y = (Math.random() * height / 2) * (Math.random() >= .5 ? 1 : 2);

        this.angle = Math.atan2(this.y - height / 2, this.x - width / 2);
        this.velX = Math.cos(this.angle)/2;
        this.velY = Math.sin(this.angle)/2;

        this.size = 1;
    }
    update() {
        this.velX *= 1.05;
        this.velY *= 1.05;
        this.x += this.velX;
        this.y += this.velY;
        this.size *= 1.025;
        if (this.x + this.size < 0 || this.x - this.size > width || this.y + this.size < 0 || this.y - this.size > height) {
            return false;
        }
        return true;
    }
}

let stars = [];

setInterval(function () {
    //clear canvas
    //context.clearRect(0, 0, width, height);
    context.fillStyle = "#002";
    context.globalAlpha = 0.33;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    context.fillStyle = "white"

    for (let i = 0; i < Math.random() * 2; i++) {
        stars.push(new Star());
    }
    for (let i = 0; i < stars.length; i++) {
        context.fillRect(stars[i].x - stars[i].size / 2, stars[i].y - stars[i].size / 2, stars[i].size, stars[i].size);
        if (!stars[i].update()) {
            stars.splice(i, 1);
            i--;
        }
    }

    context.stroke();
}, 20);