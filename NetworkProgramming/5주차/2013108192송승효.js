window.onload = function () {
    var websocket = new WebSocket("ws://echo.websocket.org");

    var textView = document.getElementById('text-view');
    var sendButton = document.getElementById('sendButton');
    var stopButton = document.getElementById('stopButton');
    var label = document.getElementById('statusLabel');
    var textArea = document.getElementById('textArea');
    var enter = '\n';

    // onOpen -> event handler running
    websocket.onopen = function (event) {
        label.innerHTML = 'echo.websocket.org에 접속됨'
    };

    websocket.onmessage = function (event) {
        if (typeof event.data === 'string') {
            textArea.innerHTML = textArea.innerHTML + event.data + enter;
        }
    };

    websocket.onclose = function (event) {
        var code = event.code;
        var reason = event.reason;
        var wasClean = event.wasClean;

        if (wasClean) {
            laebel.innerHTML = 'Connection clodes normally.';
        } else {
            label.innerHTML = 'Connection closed with messege : ' +
                reason + '(Code: ' + code + '0)';
        }
    };

    websocket.onerror = function (event) {
        label.innerHTML = 'Error: ' + event;
    };

    sendButton.onclick = function (event) {
        console.log('send button clicked');
        websocket.send(textView.value);
    };

    stopButton.onclick = function (event) {
        console.log('stop button clicked');
        websocket.close();
    };
};