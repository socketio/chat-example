var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
<<<<<<< HEAD
=======
var mongoose = require('mongoose');
>>>>>>> 6912e17404eb34f17345f6a79c040057ba0e4885

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


<<<<<<< HEAD
=======
mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + 'login.html');
});

>>>>>>> 6912e17404eb34f17345f6a79c040057ba0e4885
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
