var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyparser.urlencoded({ extended: false}));

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res){

  mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');

  var Schema = mongoose.Schema;
  
  var userSchema = new Schema({
      username : {type:String,required:true,unique:true},
      email : {type:String,required:true},
      password : {type:String, required:true}
  });

  var User = mongoose.model('User', userSchema);

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

  res.send('Registration success!');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
