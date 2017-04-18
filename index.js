var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;

var User = require('./models/User');

app.use(bodyparser.urlencoded({ extended: false}));
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));

app.get('/', function(req, res){
  var username = req.session.username;
  console.log(username);
  res.sendFile(__dirname+'/index.html', {username:username});
});

mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');
mongoose.Promise = global.Promise;

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res){

  var salt = bcrypt.genSaltSync(12);
  var hash = bcrypt.hashSync(req.body.password, salt);
  
  var newUser = User({
    username : req.body.username,
    email : req.body.email,
    password : hash
  });

  newUser.save(function(err){
    if (err) throw err;

    console.log('person saves!');
  });
  res.redirect('/login');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname+'/login.html');
});

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({username:username}, function(err, obj){

    if (err) {
      throw err;
      res.redirect('/login');
    }

    if (bcrypt.compareSync(password, obj.password)){
      req.session.username = username;
      res.redirect('/');
    }  else{
      console.log('fail!');
      res.sendFile(__dirname+'/login.html');
    }
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});