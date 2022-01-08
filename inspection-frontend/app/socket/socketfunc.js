import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './NotificationSocket';
import { GlobalWebSocketInstance } from './NotificationSocket'

//for sending new message
export const sendMessageHandler = (message) => {
    WebSocketInstance.newMessage(message);
};


//for sending new notification
export const sendNotificationHandler = (message) => {
    NotificationWebSocketInstance.newNotification(message);
};


//for updating notification count to zero
export const updateNotificationCountToZero = () => {
    GlobalWebSocketInstance.updateNotificationCountToZero();
};


//for updating the seen status of notification
export const updateNotificationSeenStatus = () => {
    GlobalWebSocketInstance.updateNotificationSeenStatus()
}

//set online status
export const setOnlineStatus = (data) => {
    GlobalWebSocketInstance.setOnlineStatus(data)
}

//for getting message and notification count 
export const getMNCount = () => {
    GlobalWebSocketInstance.getMessageNotificationCount()
}

//updates coordinates
export const updateCoordinates = (data) => {
    GlobalWebSocketInstance.updateCoordinates(data)
}

//for updating messages seen count to zero
export const updateMessagesCountToZero = () => {
    GlobalWebSocketInstance.updateMessageCountToZero();
};

//for updating message seen status
export const updateMessageSeenStatus = (data) => {
    GlobalWebSocketInstance.updateMessageSeenStatus(data)
}