const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const server = require('./config/server')
const path = require('path');
const hbs = require('hbs');
const gdc = require('./utils/gdc');

var showChat = function(res, userData) {
};

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(path.join(__dirname, '/assets')));
app.use(express.static(path.join(__dirname, '/images')));
app.set('view options', { layout: 'layout' });

app.get('/', function(req, res){
  res.render('home');
});

app.get('/chat', function(req, res){
  res.render('chat');
});

app.get('/login', function(req, res){
    if (typeof req.query.code == 'undefined') {
        res.redirect(gdc.getRedirectUrl());
        return;
    }
    var token = gdc.getToken(req.query.code, res, showChat);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(server.port, function(){
  console.log('Listening on *:' + server.port);
});
