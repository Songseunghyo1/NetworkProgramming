window.onload = function () {
    // create a reference for the require DOM elements
    var textView = document.getElementById("text-view");
    var buttonSend = document.getElementById("send-button");
    var buttonStop = document.getElementById("stop-button");
    var label = document.getElementById("status-label");

    // connect to the websocket server
    var socket = new WebSocket("ws://echo.websocket.org");

    /*
    * WebSocket open event
    * */
    socket.onopen = function (event) {
        label.innerHTML = "Connection Open"
    };

    /*
    * WebSocket onMessage event
    * */
    socket.onmessage = function (event) {
        if (typeof  event.data === "string") {
            // display message
            label.innerHTML = label.innerHTML + '<br />' + event.data;
        }
    };

    /*
    * WebSocket onclose event
    **/
    socket.onclose = function (event) {
        var code = event.code;
        var reason = event.reason;
        var wasClean = event.wasClean;

        if (wasClean)
            label.innerHTML = "Connection closed normally.";
        else
            label.innerHTML = "Connection closed with message: " + reason + "(Code: " + code + ")";
    };

    /*
    * WebSocket open event
    * */
    socket.onerror = function (event) {
        label.innerHTML = "Error: " + event;
    };

    /*
    * Disconnect and clode the connection
    * */
    buttonStop.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN)
            socket.close();
    };

    /*
    * Send the message and empty the text field
    * */
    buttonSend.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN)
            socket.send(textView.value);
    };
}























