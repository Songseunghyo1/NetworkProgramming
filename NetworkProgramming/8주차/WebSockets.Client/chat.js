/**
* Executed when the page has finished loading.
*/
window.onload = function () {

    // Create a reference for the required DOM elements.
    /** getElementById()
     * html파일에 할당된 id값을 기반으로 해당요소를가져옴
     * getElementById("html파일에 할당된 id값");
     */
    var nameView = document.getElementById("name-view");
    var textView = document.getElementById("text-view");
    var buttonSend = document.getElementById("send-button");
    var buttonStop = document.getElementById("stop-button");
    var label = document.getElementById("status-label");
    var chatArea = document.getElementById("chat-area");

    // Connect to the WebSocket server!
    /** WebSocket
     * WebSocket 객체는 서버와의 WebSocket 연결을 생성하고 관리할 수 있는 API 들을 제공
     * 이는 데이터를 전송하거나 주고 받는 등의 API 들을 포함
     * parameter는 문자열 형태로 전달
     * 이 오브젝트가 생성되면 지정된 서버로 바로 연결한다
     * 더 보기 좋게 선언하기 위해서는 넘겨줄 문자열을 변수에 할당하여 해당변수명을 넘겨주면된다.
     * "ws://localhost:8181"을 서버로 사용할것이다.
     */
    var socket = new WebSocket("ws://localhost:8181");

    /**
    * WebSocket onopen event.
     * 이 이벤트는 연결이 성공적으로 이루어진 후 발생
     * 이는 클라이언트와 서버사이의 초기핸드쉐이크가 성공적으로 이루어졌음을 의미
     * 응용프로그램이 이제 데이터를 전송할 준비가 되어있음을 의미
     *
    */
    socket.onopen = function (event) {
        // html파일로부터 가져온 label요소에 "Connection open" 출력
        label.innerHTML = "Connection open";
    }

    /**
    * WebSocket onmessage event.
     * 서버의 전송을 기다리는 클라이언트의 귀 같은 역할 담당
     * 서버가 데이터를 보낼 때 마다 OnMessage이벤트 발생
     * 메시지에는 일반텍스트 뿐만아니라 이미지나 바이너리데이터를 포함할수있다
    */
    socket.onmessage = function (event) {
        // event.data의 type이 문자열 일경우
        if (typeof event.data === "string") {
            
            // Create a JSON object.
            // JSON 형태의 문서를 파싱하여 원하는 형태로 만듬
            var jsonObject = JSON.parse(event.data);

            // Extract the values for each key.
            var userName = jsonObject.name;
            var userMessage = jsonObject.message;

            // Display message.
            chatArea.innerHTML = chatArea.innerHTML + "<p>" + userName + " says: <strong>" + userMessage + "</strong>" + "</p>";

            // Scroll to bottom.
            chatArea.scrollTop = chatArea.scrollHeight;
        }


        // event.data의 type이 Blob일 경우
        else if (event.data instanceof Blob) {
            /**
             * Blob
             * 바이너리 라지 오브젝트(Binary large object, BLOB)
             * 데이터베이스 관리 시스템의 하나의 엔티티
             * 이진 데이터의 모임
             * BLOB은 일반적으로 그림, 오디오, 또는 기타 멀티미디어 오브젝트인 것이 보통이지만,
             * 바이너리 실행 코드가 BLOB으로 저장되기도 한다.
             * BLOB에 대한 데이터베이스 지원은 보편적인 것은 아니다.
             * 자료형과 정의는 전통적인 컴퓨터 데이터베이스 시스템에 본래 정의되지 않은 데이터를 기술하기 위해 도입
             * 당시 저장하려는 크기가 너무 컸기 때문에 1970년대와 1980년대에 데이터베이스 시스템의 필드에 처음 정의
             * 디스크 공간의 값이 떨어졌을 때 이 자료형은 실용적으로 되었다.
             *  */

            // Get the raw data and create an image element.
            var blob = event.data;

            window.URL = window.URL || window.webkitURL;
            var source = window.URL.createObjectURL(blob);

            var image = document.createElement("img");
            image.src = source;
            image.alt = "Image generated from blob";

            document.body.appendChild(image);
        }
    }

    /**
    * WebSocket onclose event.
     * 대화의 종료를 나타냄
     * 이 이벤트가 발생하면 연결을 다시 시작하지않는 한 어떠한 메세지도 서버와 클라이언트 사이에 전송할 수 없음
     * 종료의 이유는 여러가지가 있음
      * 클라이언트의 close() 메소드에의해, 서버에 의해, TCP에러에 의해
    */
    socket.onclose = function (event) {

        /** code, reason, wasClean
          * close() 이벤트의 속성
          * code: 연결종료 이유를 나타내는 고유코드번호 제공
          * reason: 연결종료의 설명을 문자열로 제공
          * wasClean: 서버의 결정에 의한 종료인지, 예기치못한 네트워크동작에 의한 종료인지 여부를 나타냄
         * */
        var code = event.code;
        var reason = event.reason;
        var wasClean = event.wasClean;

        if (wasClean) {
            label.innerHTML = "Connection closed normally.";
        }
        else {
            label.innerHTML = "Connection closed with message: " + reason + " (Code: " + code + ")";
        }
    }

    /**
    * WebSocket onerror event.
     * 무엇인가문제가생겼을때발생 (일반적으로예기치못환동작이나오류)
     * onerror()이벤트가 발생하면 항상 close()이벤트 발생
     * 문제가 생겼을 때는 사용자에게 예기치못한 오류에 대해 알리고 재연결을 시도하는 것이 바람직하다
    */
    socket.onerror = function (event) {
        label.innerHTML = "Error: " + event;
    }

    /** onclick()
      * 버튼 혹은 html에서 부터 가져온 요소를 클릭하였을 때 발생하는 이벤트
      * 클릭 시 자바스크립트 코드 실행
     * Disconnect and close the connection.
      * 버튼을 눌러 연결 또는 종료이벤트 수행
    */
    buttonStop.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.close();
        }
    }

    /** onclick()
      * 버튼 혹은 html에서 부터 가져온 요소를 클릭하였을 때 발생하는 이벤트
      * 클릭 시 자바스크립트 코드 실행
     * Send the message and empty the text field.
      * 메시지를 전송하고  text field를 비운다
     */
    buttonSend.onclick = function (event) {
        sendText();
    }

    /** onkeypress()
      * 입력창에 대해 키보드로부터 입력이 있을 시 이벤트 발생
      * 키보드로부터 입력이 있을 시 자바스크립트코드 동작
     * Send the message and empty the text field.
      * 키보트로부터 입력받은 키값이 13일 경우 sendText()메소드를 실행시킨다
     */
    textView.onkeypress = function (event) {
        if (event.keyCode == 13) {
            sendText();
        }
    }

    /** ondrop()
     * https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_ondrop
      * <div>에 드래그할수있는요소가있는경우자바스크립트코드실행
      * 간단하게 drag and drop을 생각하면 된다
      * 버튼 혹은 html에서 부터 가져온 요소를 클릭하였을 때 발생하는 이벤트
      * 클릭 시 자바스크립트 코드 실행
     * Handle the drop event.
      * file을 drag and drop할 경우 file을 전송한다
     */
    document.ondrop = function (event) {
        var file = event.dataTransfer.files[0];
        socket.send(file);

        return false;
    }

    /** ondragover()
     * https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_ondragover
      * html의요소를drag하여특정위치에drop가능
      * drag하여 drop한 자리에 요소가 옮겨짐
     * Prevent the default behaviour of the dragover event.
      * 빈 요소를 dragover하는 것을 막는다
    */
    document.ondragover = function (event) {
        event.preventDefault();
    }

    /** sendText()
     * 문자열을 전송하는 메소드
    * Send a text message using WebSocket.
     * WebSocket을 사용하여 문자열 전송
    */
    function sendText() {
        // WebSocket.OPEN일 경우
        if (socket.readyState == WebSocket.OPEN) {
            // json 형태로 문자열을 생성하여 전송
            var json = '{ "name" : "' + nameView.value + '", "message" : "' + textView.value + '" }';
            socket.send(json);

            textView.value = "";
        }
    }
}