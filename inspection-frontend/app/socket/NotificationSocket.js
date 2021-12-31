import { SOCKET_URL } from "@env";
import { store } from 'app/store'


export class WebSocketNotificationService {
    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketNotificationService.instance) {
            WebSocketNotificationService.instance = new WebSocketNotificationService();
        }
        return WebSocketNotificationService.instance;
    }

    constructor() {
        this.socketRef = null;
    }


    connect(room_name) {

        if(room_name != null){
            let access_token = store.getState().auth.login.token_access

            const path =`${SOCKET_URL}/ws/notification/${room_name}/?token=${access_token}`;

            this.socketRef = new WebSocket(path);

            this.socketRef.onopen = () => {
                console.log("WebSocket notification service open");
            };

            this.socketRef.onmessage = e => {
                this.socketNewMessage(e.data);
            };

            this.socketRef.onerror = e => {
                console.log(e.message);
            };

            this.socketRef.onclose = () => {
                console.log("WebSocket notification service closed let's reopen");
                this.connect();
            };
        }

    }

    disconnect() {
        this.socketRef.close();
    }


    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        console.log(parsedData," socket new")
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "fetch_notifications") {
            this.callbacks[command](parsedData.notifications);
        }

        else if(command === "count_notifications") {
            this.callbacks[command](parsedData.unseen_notifications);
        }
    }

    fetchNotification() {
        this.sendMessage({
            command: "fetch_notifications",
        })
    }

    newNotification(data) {
        this.sendMessage({
            command: "new_notification",
            data: data
        })
    }

    countNotification(){
        this.sendMessage({
            command: "count_notifications",
        })
    }

    updateNotificationSeenStatus() {
        this.sendMessage({
            command: "update_notification_seen_status",
        })
    }
    

    addCallbacks({ setNotificationsfunc, setNotificationCount }) {

        if(typeof setNotificationsfunc === "function"){
            this.callbacks["fetch_notifications"] = setNotificationsfunc;
        }

        else if(typeof setNotificationCount === "function"){
            this.callbacks["count_notifications"] = setNotificationCount;

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

const WebSocketInstance = WebSocketNotificationService.getInstance();

export const GlobalWebSocketInstance = WebSocketNotificationService.getInstance();


export default WebSocketInstance;