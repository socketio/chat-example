var express = require('express');
var app = express();
app.use('/css', express.static(__dirname + '/public/css'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('sound received', function(e){
    io.emit('sound received', e);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


