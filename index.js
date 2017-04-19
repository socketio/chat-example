var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session')({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
}),sharedsession = require("express-socket.io-session");

var port = process.env.PORT || 3000;

var User = require('./models/User');
var Message = require('./models/Message');

app.use(bodyparser.urlencoded({ extended: false}));
app.use(session);

io.use(sharedsession(session));

app.get('/', function(req, res){
  var username = req.session.username;
  res.sendFile(__dirname+'/index.html', {username:username});
});


mongoose.Promise = global.Promise;

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res){
  mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');

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

  mongoose.disconnect();

  res.redirect('/login');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname+'/login.html');
});

app.post('/login', function(req, res){

  var username = req.body.username;
  var password = req.body.password;

  mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');

  User.findOne({username:username}, function(err, obj){

    if (err) {
      throw err;
      mongoose.disconnect();
      res.redirect('/login');
    }

    if (bcrypt.compareSync(password, obj.password)){
      
      mongoose.disconnect();
      req.session.username = username;
      res.redirect('/');
    }  else{
      console.log('fail!');
      mongoose.disconnect();
      res.sendFile(__dirname+'/login.html');
    }
  });
});

io.on('connection', function(socket){
  var username = socket.handshake.session.username;
  
  socket.on('chat message', function(msg){
    mongoose.connect('mongodb://msgAdmin:msg1234@ds163940.mlab.com:63940/chat_messages');
    io.emit('chat message', {
      username : username,
      msg : msg});
    
    var newmsg = Message({
      username:username,
      msg:msg
    });

    newmsg.save(function(err){
    if (err) throw err;

    console.log('Message saves!');
  });

  mongoose.disconnect();
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});