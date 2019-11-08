$(function () {
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });

    $('.player1').click(function(){
        socket.emit('sound received', 'rien');
        return false;
    });

    var bufferSize = 256;

    var frequence = 0;
    var amplitude = 0;
    var maxAmplitude = 0;

    var sum = 0;
    var count = 0;
    var avg = 0;

    const player1 = document.querySelector('.player1');
    const player2 = document.querySelector('.player2');

    var move= 0;


    var recorder;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();
            var mediaStream = context.createMediaStreamSource(stream);
            var numberOfInputChannels = 2;
            var numberOfOutputChannels = 2;
            if (context.createScriptProcessor) {
                recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            } else {
                recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            }

            recorder.onaudioprocess = function (e) {
                var chanl = e.inputBuffer.getChannelData(0);
                var chanr = e.inputBuffer.getChannelData(1);
                amplitude = 0;
                frequence = 0;
                var mem = 0;
                var l = 0;
                var r = 0;
                for (var i in chanl) {
                    l = chanl[i];
                    r = chanr[i];
                    amplitude += Math.abs(l)+Math.abs(r);
                    if ((l<0 && mem>0) || (l>0 && mem<0))
                        frequence++;
                    mem = l;
                }
                /*  if (maxAmplitude<amplitude){
                      maxAmplitude = amplitude;
                  }*/

                sum += frequence;
                count++;

                if (count == 10){
                    avg = sum/count;
                    count = 0;
                    sum = 0;
                }

                if (avg < Math.max(4) && avg > Math.min(0)) {
                    move+=1;
                    player1.style.transform = 'translateY(-' + move+ 'px)';
                    player2.style.transform = 'translateY(-' + move+ 'px)';
                }
            };

            mediaStream.connect(recorder);
            recorder.connect(context.destination);


        }).catch(function(err) {
        console.log("Stream not OK");

    });

    socket.on('sound received', function(){
        $(".player2").css("background-color", "yellow");
    });

});
