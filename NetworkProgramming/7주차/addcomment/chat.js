/**
 * Executed when the page has finished loading.
 */
window.onload = function () {

    // Create a reference for the required DOM elements.

    /** document.getElementById(html file의 tag에 선언된 id value)
     * html file로부터 해당요소(id)를 가져와 변수에 선언한다.
     * 이 scriptfile이 적용된 html file에서 id가 존재하면 해당 태그를 불러와 변수에 할당한다.
     * 만약 해당하는 id가 없을 경우 변수에  할당되지않으며 할당되지않은 변수에 특정이벤트를 실행시킬 경우 웹문서의
     * 개발자도구를 보면 에러를 출력하는 경우도있다.
    */
    var textView = document.getElementById("text-view");
    var buttonSend = document.getElementById("send-button");
    var buttonStop = document.getElementById("stop-button");
    var label = document.getElementById("status-label");

    // Connect to the WebSocket server!
    /** WebSocket
     * 표준 WebSocket의 API는 W3C에서 관장하고, 프로토콜은 IETF(Internet Engineering Task Force)에서 관장한다
     * WebSocket은 모든 웹브라우저가 지원하는것은 아니며 브라우저의 특정버전 이상일 경우에 만지원한다.
     * WebSocket 객체는 서버와의 WebSocket 연결을 생성하고 관리할 수 있는 API 들을 제공한다
     * 이는 데이터를 전송하거나 주고 받는 등의 API 들을 포함한다.
     * parameter로는 url, protocol을 넘겨줄 수 있으며 url 하나만 넘겨줄 수도있다.
     * */
    var socket = new WebSocket("ws://echo.websocket.org");

    /**
     * WebSocket onopen event.
     * onopen event는 연결이 성공적으로 이루어진 후 발생한다.
     * 이는 클라이언트와 서버사이의 초기 핸드쉐이가 성공적으로 이루어졌으며 응용프로그램이 이제테이터를 전송할 준비가 되었음을 의미한다.
     *  웹소켓 자체는 빠르지만 인터넷 속도가 느려 지연되는 현상이 발생할 수 있으니 연결을 기다리는 동안 사용자에게 피드백을 제공하는 것이좋다
     */
    socket.onopen = function (event) {
        // 연결이 성공적으로 이루어지고 초기 핸드쉐이크가 성공하면이 javascript파일이 적용된 html문서 실행화면에
        // "Connection open"이라 는메세지 가출력된다.
        label.innerHTML = "Connection open";
    }

    /**
     * WebSocket onmessage event.
     * 서버의 전송을 기다리는 클라이언트의 귀같은 역할담당
     * 서버가 데이터를 보낼때마다 onmessage event가 발생한다
     * 메시지에는 일반텍스트뿐만 아니라 이미지나 바이너리데이터를 포함할수있다
     * 데이터를 어떻게 해석하고 시각화할지는 사용자에게 달려있음
     */
    socket.onmessage = function (event) {
        // event.data의 type이 문자열일 경우
        if (typeof event.data === "string") {
            // Display message. html문서 실행화면에 출력
            label.innerHTML = label.innerHTML + "<br />" + event.data;
        }
    }

    /**
     * WebSocket onclose event.
     * 대화 의종료를나타낸
     * 이 이벤트가 발생하면 연결을 다시 시작하지않는한 어떠한 메세지도 서버와 클라이언트 사이에 전송할 수 없다.
     * 연결의 종료는 여러가지의 이유로인해 종료될 수 있다.
     * 서버에 의한 종료, 클라이언트의 close()메소드에 의해 종료, TCP에러에 의한 종료등
     */
    socket.onclose = function (event) {
        // code변수에 event.code를 설정한다
        var code = event.code;
        // reason변수에 event.reason을 설정한다
        var reason = event.reason;
        // wasClean변수에  event.wasClean을 설정한다
        var wasClean = event.wasClean;

        // 정상적으로 connection이 종료되었을 때
        if (wasClean) {
            label.innerHTML = "Connection closed normally.";
        }
        else {
            // 정상적이지 않은 connection의 종료가 발생했을때 reason과 code를 함께 출력하여 종료원인 을얼려줌
            label.innerHTML = "Connection closed with message: " + reason + " (Code: " + code + ")";
        }
    }

    /**
     * WebSocket onerror event.
     * 무엇인가 문제가 생겼을 때 발생 (일반적으로 예기치 못한 동작이나 오류)
     * onerror event 다음에는 연결종료(onclose event)이벤트가 뒤따름
     * 무엇인가 문제가 발생했을 때 예상치못한 오류에대해 알리고 재연결을 시도하는 것이 바람직하다
     */
    socket.onerror = function (event) {
        // 에러발생시 html실행화면에 메세지출력
        label.innerHTML = "Error: " + event;
    }

    /**
     * Disconnect and close the connection.
     * onclick event는 html에서 요소의 클릭이벤트가 발생할 경우 해당메소드의 코드를 실행함
     * var buttonStop = document.getElementById("stop-button");를 이용하여 가져온 요소를 클릭하면 발생
     */
    buttonStop.onclick = function (event) {
        // 버튼이 눌렸을 때
        // socket의 상태가 OPEN이라면
        if (socket.readyState == WebSocket.OPEN) {
            //socket을 close 시킨다
            socket.close();
        }
    }

    /**
     * Disconnect and close the connection.
     * onclick event는 html에서 요소의 클릭이벤트가 발생할 경우 해당메소드의 코드를 실행함
     * var buttonSend = document.getElementById("send-button");를 이용하여 가져온 요소를 클릭하면 발생
     */
    buttonSend.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(textView.value);
        }
    }
}