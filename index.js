var express = require('express');
var app = express();
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/sound', express.static(__dirname + '/public/sound'));
app.use('/images', express.static(__dirname + '/public/images'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var Game = require('./js/game');



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('A user connected!');

  socket.on('sound received', function(frequence){
    console.log('sound receiveeed');
    io.emit('sound received', frequence);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


