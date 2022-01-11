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


    connect(room_name) {

        if(room_name != null){
            let access_token = store.getState().auth.login.token_access

            const path =`${SOCKET_URL}/ws/chat/${room_name}/?token=${access_token}`;

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

            this.socketRef.onclose = (value) => {
                console.log("WebSocket closed let's reopen", room_name);
                
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

        if (command === "new_message") {
            this.callbacks[command](parsedData.message);
        }
    }

    newMessage(message) {
        this.sendMessage({
            command: "new_message",
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,

        });
    }

    updateUnseen(selectedUser){
        this.sendMessage({
            command: "update_un_seen",
            selectedUser
        });
    }

    addCallbacks({ addMessagesfunc }) {

        if(typeof addMessagesfunc === "function"){
            this.callbacks["new_message"] = addMessagesfunc;
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