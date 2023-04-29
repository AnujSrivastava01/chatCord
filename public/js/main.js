const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMesssages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and Room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//Join room emit msg
socket.emit('joinRoom', {username, room})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

//Receiving msg from server
socket.on('message', msg =>{
    outputMesssage(msg)

    //Scroll Down
    chatMesssages.scrollTop = chatMesssages.scrollHeight;
})

//chat msg event
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    //grabbing chat msg
    const msg = e.target.elements.msg.value;

    //Emit chat msg to server
    socket.emit('chatMesssage', msg)

    //Clear input box after emitting chat msg
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

//Output msg to DOM
const outputMesssage = (msg)=> {
const div = document.createElement('div')
div.classList.add('message');
div.innerHTML = `<p clas="meta">${msg.username} <span>${msg.time}</span></p>
<p class="text">
${msg.message}
</p>`
document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
const outputRoomName = (room)=> {
    roomName.innerText = room;
  }
  
// Add users to DOM
const outputUsers = (users)=> {
userList.innerHTML = '';
users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
});
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });