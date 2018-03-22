const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const server = require('./config/server')
const path = require('path');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(path.join(__dirname, '/assets')));
app.set('view options', { layout: 'layout' });

app.get('/', function(req, res){
  res.render('home');
});

app.get('/chat', function(req, res){
  res.render('chat');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(server.port, function(){
  console.log('Listening on *:' + server.port);
});
