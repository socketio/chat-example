var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    // Display Log in Terminal
    console.log(" A User connected ! ");
    // Chat Message Event
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    // Disconnect Event
    socket.on('disconnect', function () {
        console.log(" User disconnected ! ");
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
