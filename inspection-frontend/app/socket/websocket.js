import { SOCKET_URL } from "@env";
import { store } from 'app/store'


export class WebSocketService {
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


    connect(room_name, service) {

        if(room_name != null){
            let access_token = store.getState().auth.login.token_access

            const path =`${SOCKET_URL}/ws/${service}/${room_name}/?token=${access_token}`;

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
    
    fetchMessegerList(currentUser, selectedUser) {
        this.sendMessage({
            command: "mesenger_list",
            currentUser,
            selectedUser,
        })
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