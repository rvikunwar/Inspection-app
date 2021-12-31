import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './NotificationSocket';


export const sendMessageHandler = (message) => {
    WebSocketInstance.newMessage(message);
};


export const OnlineStatusSet = (data) => {
    WebSocketInstance.onlineStatus(data);
}


//for sending new notification
export const sendNotificationHandler = (message) => {
    NotificationWebSocketInstance.newNotification(message);
};