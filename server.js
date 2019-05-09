import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const httpServer = new http.Server(app);
const io = socketIO(httpServer);
const port = process.env.PORT || 3000;

app.use(express.static('browser'));
app.get('/', (req, res) => res.sendFile(__dirname + '/browser/index.html'));
io.on('connection', socket => {
  socket.on('chat message', msg => io.emit('chat message', msg));
});
httpServer.listen(port, () => console.log(`listening on port ${port}!`));