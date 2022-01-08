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
                this.connect(room_name);
            };
        }

    }

    disconnect() {
        this.socketRef.close();
    }


    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        console.log(parsedData)

        const command = parsedData.command;
        
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }

        if(command === "new_notification"){
            this.callbacks[command](parsedData.notification);
        }

        if(command === "new_message"){
            console.log('sshshh')
        }

        if(command === "get_message_notification_count"){
            this.callbacks[command](parsedData);
        }

    }

    newNotification(data) {
        this.sendMessage({
            command: "new_notification",
            data: data
        })
    }

    updateNotificationSeenStatus() {
        this.sendMessage({
            command: "update_notification_seen_status",
        })
    }

    updateMessageSeenStatus(data) {
        this.sendMessage({
            command: "update_message_seen_status",
            sender: data
        })
    }
    
    updateMessageCountToZero() {
        this.sendMessage({
            command: "set_messages_count_to_zero",
        })
    }

    updateNotificationCountToZero() {
        this.sendMessage({
            command: "update_notification_count_to_zero",
        })
    }

    setOnlineStatus(status) {
        this.sendMessage({
            command: "set_online_status",
            status
        })
    }
 
    getMessageNotificationCount() {
        this.sendMessage({
            command: "get_message_notification_count",
        })
    }

    updateCoordinates(data) {
        this.sendMessage({
            command: "update_coordinates",
            data
        })
    }

    updateMessagesCountToZero(){
        this.sendMessage({
            command: "set_messages_count_to_zero",
        })
    }
    
    addCallbacks({ setNewNotification, setMessageANDNotificationCount }) {

        if(typeof setNewNotification === "function"){
            this.callbacks["new_notification"] = setNewNotification;
        }
        
        if(typeof setMessageANDNotificationCount === "function"){
            this.callbacks["get_message_notification_count"] = setMessageANDNotificationCount;
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