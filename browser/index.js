const chatApp = () => {
  // @ts-ignore
  const socket = io();
  $('form').submit(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', msg => {
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
};