import { SOCKET_URL } from "@env";

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }


  connect(chat_url) {

    if(chat_url != null){
    const path =`${SOCKET_URL}/ws/chat/${chat_url}/`;

    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };

    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };

    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
    }

  }

  disconnect() {
    this.socketRef.close();
  }


  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "fetch_messages") {
      this.callbacks[command](parsedData.message);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
    if(command === "online_status"){
      this.callbacks[command](parsedData);
    }
  }
  

  fetchMessages(currentUser, selectedUser) {
    this.sendMessage({
      command: "fetch_messages",
      currentUser,
      selectedUser,
    });
  }

  newMessage(message) {
    this.sendMessage({
      command: "new_message",
      sender: message.sender,
      receiver: message.receiver,
      content: message.content,

    });
  }

  onlineStatus(data){
    this.sendMessage({
      command: "online_status",
      user: data.user,
      status: data.status
    })
  }

  addCallbacks({setMessagesfunc, addMessagesfunc, UserDetails}) {

    if(typeof setMessagesfunc === "function"){
      this.callbacks["fetch_messages"] = setMessagesfunc;
    }

    if(typeof addMessagesfunc === "function"){
      this.callbacks["new_message"] = addMessagesfunc;
    }

    if(typeof UserDetails === "function"){
      this.callbacks["online_status"] = UserDetails;
    }

  }

  sendMessage(data) {

    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;