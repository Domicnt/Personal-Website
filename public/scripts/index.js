//script that is sent to client

//set up canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight / 3;
context.canvas.width = width;
context.canvas.height = height;

let cursor = new Image();
cursor.src = "../assets/cursor.png";

let sWidth;
let sHeight;

let ID;
let fidelity = 20;
let soon = false;
let cursors = [];
let ball = {r: width / 10, x: width / 2, y: height / 2, Vx: 0, Vy: 0};

setInterval(function () {
    //clear canvas
    //context.clearRect(0, 0, width, height);
    context.fillStyle = "#77a";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "black"

    //draw ball
    context.beginPath();
    context.arc(ball.x * width / sWidth, ball.y * height / sHeight, ball.r * width / sWidth, 0, 2 * Math.PI, false);
    context.fill();

    //draw cursors
    for (let i = 0; i < cursors.length; i++) {
        context.drawImage(cursor, cursors[i][1] * width / sWidth, cursors[i][2] * height / sHeight);
    }
    context.stroke();
}, 20);

//set up socket
//var socket = io.connect('http://localhost/');
var socket = io.connect('https:///p3r50n41.herokuapp.com');

//send new location to server if moving
canvas.addEventListener('mousemove', function(e){
    if (!soon) {
        const rect = canvas.getBoundingClientRect()
        socket.emit('cursor', [ID, (e.clientX - rect.left) * sWidth / width, (e.clientY - rect.top) * sHeight / height]);
        soon = true;
        setTimeout(function () {
            soon = false;
        }, fidelity);
    }
});

//on recieving messages from server
socket.on('cursors', function(data) {
    cursors = data;
});
socket.on('ball', function(data) {
    ball = data;
});
socket.on('ping', function(data) {
    socket.emit('pong');
});
socket.on('pong', function(data) {
    console.log('Ping to server returned');
});

socket.on('ID', function (data) { ID = data; });
socket.on('dimensions', function (data) { sWidth = data[0]; sHeight = data[1] });