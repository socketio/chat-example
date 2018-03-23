$(function () {
    var socket = io();
    $('form').submit(function(){
        socket.emit('send message', {
            message: $('#m').val(),
            user: currentUser,
            uservanity: currentVanity,
            username: userName
        });
        $('#m').val('');
        return false;
    });
    //socket.emit('join', {{networks}});
    socket.on('receive message', function(msg){
        $('#messages').append($('<li>').html('<a class="username" href="https://gensdeconfiance.fr/m/'+msg.uservanity+'" target="_blank">'+ msg.username+'</a>: '+msg.message));
        window.scrollTo(0, document.body.scrollHeight);
    });
});
