$(function () {
    var socket = io();
    var room = 'all';
    $('form').submit(function(){
        socket.emit('send message', {
            message: $('#m').val(),
            user: currentUser,
            uservanity: currentVanity,
            username: userName,
            room: room
        });
        $('#m').val('');
        return false;
    });
    $('#networks li').click(function(){
        socket.emit('join room', {room: $(this).text(), user: {user: currentUser, uservanity: currentVanity}});
        $('#networks li.current').removeClass('current');
        $(this).addClass('current');
        room = $(this).text();
        $('#messages').html('<li><i>Welcome on '+room+'</i></li>');
    });

    socket.on('receive message', function(msg){
        $('#messages').append($('<li>').html('<a class="username" href="https://gensdeconfiance.fr/m/'+msg.uservanity+'" target="_blank">'+ msg.username+'</a>: '+msg.message));
        window.scrollTo(0, document.body.scrollHeight);
    });
});
