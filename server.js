//script run on server

const express = require('express');
const app = express();
//automatically serves all files in 'public' folder
app.use(express.static("public"));

const server = require('http').Server(app)
server.listen(process.env.PORT || 80);
const io = require('socket.io')(server);
const fs = require('fs');

//connections' IDs
let connections = [];
let connectionIDs = [];

function newID() {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

let width = 320;
let height = 180 / 3;

let cursors = [];
let ball = {r: width / 50, x: width / 2, y: height / 2, Vx: 0, Vy: 0};

setInterval(function () {
    io.sockets.emit('cursors', cursors);
    io.sockets.emit('ball', ball);
}, 20);

setInterval(function () {
    for (i = 0; i < cursors.length; i++) {
        let dist = Math.sqrt((cursors[i][1] - ball.x) * (cursors[i][1] - ball.x) + (cursors[i][2] - ball.y) * (cursors[i][2] - ball.y));
        if (dist < ball.r) {
            ball.Vx += (ball.x - cursors[i][1]) / dist;
            ball.Vy += (ball.y - cursors[i][2]) / dist;
        }
    }
    ball.x += ball.Vx;
    ball.y += ball.Vy;
    ball.Vx *= .99;
    ball.Vy *= .99;
    if (ball.x - ball.r < 0) {
        ball.x = ball.r;
        ball.Vx *= -.8;
    } else if (ball.x + ball.r > width) {
        ball.x = width - ball.r;
        ball.Vx *= -.8;
    }
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.Vy *= -.8;
    } else if (ball.y + ball.r > height) {
        ball.y = height - ball.r;
        ball.Vy *= -.8;
    }
}, 20);

io.on('connection', function (socket) {
    let ID = newID();
    connections.push(socket);
    connectionIDs.push(ID);
    socket.emit('ID', ID);
    socket.emit('dimensions', [width, height]);

    //on recieving messages from client
    socket.on('ping', function(data) {
        socket.emit('pong');
    });
    socket.on('pong', function(data) {
        console.log('Ping to client returned');
    });
    socket.on('cursor', function(data) {
        let index = cursors.map(x => x[0]).indexOf(ID);
        if (index == -1) {
            cursors.push(data);
        } else {
            cursors[index] = data;
        }
    });

    //when this connection disconnects
    socket.on('disconnect', function () {
        let index = cursors.map(x => x[0]).indexOf(ID);
        if (index != -1) 
            cursors.splice(index);

        let disconnected = 0;
        for (let i = 0; i < connectionIDs.length; i++) {
            if (ID == connectionIDs[i]) {
                disconnected = i;
                connections.splice(disconnected, 1);
                connectionIDs.splice(disconnected, 1);
                break;
            }
        }
    });
});