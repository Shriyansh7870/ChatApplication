const socket = io();

const clientTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-conatiner");
const nameInput = document.getElementById("name-input");
const MessageForm = document.getElementById("message-Form");
const MessageInput = document.getElementById("message-input");

MessageForm.addEventListener("Submit", (e) => {
  e.preventDefault();
  SendFunction();
});

socket.on("client-total", (data) => {
  clientTotal.innerText = `Total clients:${data}`;
});
function SendFunction() {
  if (MessageInput.value === "") return;

  const data = {
    name: nameInput.value,
    message: MessageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addmessageToUI(true, data);
}

socket.on("message", (data) => {
  // console.log(data);
  addmessageToUI(false, data);
  MessageInput.value = "";
});

function addmessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `  
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
       ${data.message}
        <span>${data.name}  ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`;

  messageContainer.innerHTML += element;
  scrollTo();
}

function scrollTo() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

MessageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
MessageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
MessageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feeback", (data) => {
  clearFeedback();
  const element = `
  <li class="message-feedback">
  <p class="feedback" id="feedback">
    ${data.feedback}
  </p>
</li>
  `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
socket.on("popup", (message) => {
  alert(message);
});
