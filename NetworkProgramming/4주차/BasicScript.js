var buttonSend = document.getElementById('send-button');
var buttonStop = document.getElementById('stop-button');

buttonSend.onclick = function clickSend() {
  console.log('Button Clicked');
};

buttonStop.onclick = function clickStop() {
    console.log('Button Clicked')
};

if (window.WebSocket) {
  console.log('WebSockets supported.');

  // start web socket function
} else  {
  console.log('WebSockets not supported.');
  alert("Consider updating your browser for a ritcher experience.");
}