import WebSocketInstance from './websocket';

export const sendMessageHandler = (message) => {
    WebSocketInstance.newMessage(message);
};


export const OnlineStatusSet = (data) => {
    WebSocketInstance.onlineStatus(data);
}