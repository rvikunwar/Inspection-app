export const userSelect = (state) => state.auth.user;

export const languageSelect = (state) => state.application.language;
export const getInto = (state) => state.application.intro;

//notification
export const getNotificationCount = (state) => state.notification.count;

//messages
export const getUnseenMessages = (state) => state.auth.user.unseen_messages;
