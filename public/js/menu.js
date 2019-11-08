let audio = document.querySelector("audio");
let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();
let source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
audio.play();
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

let body = document.querySelector('body');
let canvas = document.querySelector("canvas");
let startParty = document.querySelector(".startParty");
let c = canvas.getContext("2d");

let rect = body.getBoundingClientRect();

canvas.width = rect.width;
canvas.height = rect.height;

let w = canvas.width;
let h = canvas.height;

let x = w / 2;
let y = h / 2;

let radius = 260;


let p = {
    x:100,
    y:100,
    vx: 1,
    vy: 0,
    a: 0,
};

function startTheParty() {
    startParty.addEventListener("click", function() {
        document.querySelector('.menu').classList.add('hidden');
        document.querySelector('.overlay-menu').classList.add('hidden');
        document.querySelector('.round').classList.add('hidden');

    });
}
startTheParty();


function draw()  {
    analyser.getByteFrequencyData(frequencyData);
    c.clearRect(0,0, w, h);

    let n = frequencyData.length;

    var lingrad = c.createLinearGradient(0, 0, 0, 600);
    lingrad.addColorStop(0, '#22427c');
    lingrad.addColorStop(1, '#BA55D3');

    c.save();
    c.beginPath();
    c.fillStyle = lingrad;
    c.arc(x, y, radius,0, Math.PI*2);
    c.lineWidth = 1;
    c.strokeStyle = lingrad;
    c.stroke();
    c.fill();
    c.beginPath();

    // ROND
    for(let i in frequencyData) {
        let f = frequencyData[i];
        let a = 2*Math.PI*i/(n*0.35);
        c.beginPath();
        c.strokeStyle = lingrad;
        c.lineWidth = 90;
        c.moveTo(w/2+radius*Math.cos(a),
            h/2+radius*Math.sin(a),);
        c.lineTo(w/2+(radius+f)*Math.cos(a),
            h/2+(radius+f)*Math.sin(a),);
        c.stroke()

    }


    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
