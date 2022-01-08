export const userSelect = (state) => state.auth.user;

export const languageSelect = (state) => state.application.language;
export const getInto = (state) => state.application.intro;

//notification count
export const getNotificationCount = (state) => state.auth.user.notfication_count;

//messages
export const getUnseenMessages = (state) => state.auth.user.unseen_messages;

