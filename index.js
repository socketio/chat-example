const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const server = require('./config/server')
const path = require('path');
const hbs = require('hbs');
const gdc = require('./utils/gdc');
const networks = require('./utils/networks');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const rooms = require('./utils/rooms');

app.use(require('morgan')('dev'));

var members = {};
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: '_scrt_'+gdc.client_secret,
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
var showChat = function(res, req, userData) {
    userData.uuid = uuidv4();
    networks.handleUser(userData);
    userData.fullName = userData.firstName+' '+userData.lastName;
    userData.room = rooms.getDefaultRoom();
    members[userData.vanity] = userData;
    req.session.token = userData.token;
    res.render('chat', {
        'currentUser': userData,
        'networks': networks.list(userData),
        'rooms': rooms
    });
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

app.get('/login', function(req, res){
    if (typeof req.query.code == 'undefined' && !req.session.token) {
        res.redirect(gdc.getRedirectUrl());
        return;
    }
    if (req.session.token) {
        console.log('logged using sessions');
        gdc.getUserInfo(req.session.token, res, req, showChat);
    } else {
        gdc.getToken(req.query.code, res, req, showChat);
    }
});

io.on('connection', function(socket){
    socket.join(rooms.getDefaultRoom());
    var msgs = rooms.read('all');
    msgs.forEach(function(msg){
        socket.emit('receive message', msg);
    });
    socket.on('join room', function(data){
        console.log(data);
        var user = members[data.user.uservanity];
        if (user.room) {
            rooms.leave(user.room);
            socket.leave(user.room);
        }
        rooms.join(data.room);
        socket.join(data.room);
        members[data.user.uservanity].room = data.room;
        console.log(data.user.uservanity+' joined room '+data.room);
        var msgs = rooms.read(data.room);
        msgs.forEach(function(msg){
            socket.emit('receive message', msg);
        });
    });
    socket.on('send message', function(msg){
        console.log(msg);
      if (typeof members[msg.uservanity] == 'undefined' || members[msg.uservanity].uuid != msg.user) {
          console.log('Invalid userdata');
          return false;
      }
      io.to(msg.room).emit('receive message', {
          message: msg.message,
          username: msg.username,
          uservanity: msg.uservanity,
          room: msg.room
      });
      rooms.write(msg);
  });
});

 http.listen(server.port, function(){
  console.log('Listening on *:' + server.port);
});
