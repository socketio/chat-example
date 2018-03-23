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

var members = {};

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: '_scrt_'+gdc.client_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  genid: function(req) {
    return uuidv4()
  }
}))
var showChat = function(res, req, userData) {
    userData.uuid = uuidv4();
    networks.handleUser(userData);
    userData.fullName = userData.firstName+' '+userData.lastName;
    members[userData.vanity] = userData.uuid;
    res.render('chat', {
        'currentUser': userData,
        'networks': networks.list(userData)
    });
    req.session.token = userData.token;
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
        gdc.getUserInfo(req, req.session.token);
    } else {
        gdc.getToken(req.query.code, res, req, showChat);
    }
});

io.on('connection', function(socket){
  socket.on('send message', function(msg){
    if (typeof members[msg.uservanity] == 'undefined' || members[msg.uservanity] != msg.user) {
      return false;
    }
    io.emit('receive message', {
        message: msg.message,
        username: msg.username,
        uservanity: msg.uservanity
    });
  });
});

 http.listen(server.port, function(){
  console.log('Listening on *:' + server.port);
});
