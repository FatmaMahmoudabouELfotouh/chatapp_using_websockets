let userName = prompt("Please enter your name");
console.log(userName);

var header = document.getElementById('header');
header.innerHTML = `User ${userName}`;

var chatContainer = document.getElementById('chatContainer');
var messageInput = document.getElementById('messageInput');
var sendBtn = document.getElementById('sendBtn');
var clearBtn = document.getElementById('clearBtn');
var userList = document.getElementById('userList');

const mywebsocket = new WebSocket('ws://localhost:8000');

mywebsocket.onopen = function () {
    console.log('connection opened', this);
    const loginMessage = {
        userName: userName,
        login: true
    };
    this.send(JSON.stringify(loginMessage));
};

mywebsocket.onmessage = function (event) {
    console.log(event.data);
    const data = JSON.parse(event.data);
    if (data.type === 'login') {
        chatContainer.innerHTML += `<h5 class="text-center text-success">${data.message}</h5>`;
    } else if (data.type === 'logout') {
        chatContainer.innerHTML += `<h5 class="text-center text-danger">${data.message}</h5>`;
    } else if (data.type === 'chat') {
        chatContainer.innerHTML += `<h5 class="w-50 bg-dark rounded-2 text-wrap text-light p-2 mx-2">${data.message}</h5>`;
    }

    userList.innerHTML = '';
    data.online.forEach((user) => {
        userList.innerHTML += `<li class="list-group-item"><span class="rounded-circle p-1 m-1 bg-success"></span>${user}</li>`;
    });
};

mywebsocket.onerror = function () {
    chatContainer.innerHTML += '<h3 style="color: red">Error connecting to server</h3>';
};

sendBtn.addEventListener('click', function () {
    const message = messageInput.value;
    const chatMessage = {
        body: `${userName}: ${message}`
    };
    mywebsocket.send(JSON.stringify(chatMessage));
    messageInput.value = '';
});

clearBtn.addEventListener('click', function () {
    chatContainer.innerHTML = '';
});


mywebsocket.onclose= function (){

};