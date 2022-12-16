const socket=io('http://localhost:8000');



const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container");
const stat=document.getElementById('typingStatus');
var audio= new Audio('Facebook Messenger Pop Ding Tone.mp3');

const append= (message, position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

form.addEventListener('keypress', ()=>{
    socket.emit('typing', name);
});

socket.on('typing', name=>{
    stat.innerHTML=`<p><em>${name}</em> is typing...</p>`;
    setTimeout(()=>{
        stat.innerHTML='';
    },5000);
})

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    messageInput.value='';
    stat.innerHTML='';
});

const name = prompt("Enter your name to join");
socket.emit('new-user-joined' , name);

socket.on('user-joined', name=>{
    append(`<b>${name}</b> joined the chat`, 'right');
});

socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name =>{
    append(`${name}: left the chat`, 'right');
});