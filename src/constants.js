export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const OrderStatusEnum = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED",
};

export const AvailableOrderStatuses = Object.values(OrderStatusEnum);

export const PaymentProviderEnum = {
    UNKNOWN: "UNKNOWN",
    RAZORPAY: "RAZORPAY",
    PAYPAL: "PAYPAL",
};

export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

export const CouponTypeEnum = {
    FLAT: "FLAT",
    // PERCENTAGE: "PERCENTAGE",
};

export const AvailableCouponTypes = Object.values(CouponTypeEnum);

export const UserLoginType = {
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

export const YouTubeFilterEnum = {
    MOST_VIEWED: "mostViewed",
    MOST_LIKED: "mostLiked",
    LATEST: "latest",
    OLDEST: "oldest",
};

export const AvailableYouTubeFilters = Object.values(YouTubeFilterEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const MAXIMUM_SUB_IMAGE_COUNT = 4;
export const MAXIMUM_SOCIAL_POST_IMAGE_COUNT = 6;

export const DB_NAME = "paper-bot";

export const paypalBaseUrl = {
    sandbox: "https://api-m.sandbox.paypal.com",
};

export const ChatEventEnum = Object.freeze({
    CONNECTED_EVENT: "connected",
    DISCONNECT_EVENT: "disconnect",
    JOIN_CHAT_EVENT: "joinChat",
    LEAVE_CHAT_EVENT: "leaveChat",
    UPDATE_GROUP_NAME_EVENT: "updateGroupName",
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    NEW_CHAT_EVENT: "newChat",
    SOCKET_ERROR_EVENT: "socketError",
    STOP_TYPING_EVENT: "stopTyping",
    TYPING_EVENT: "typing",
    MESSAGE_DELETE_EVENT: "messageDeleted",
});
export const AvailableChatEvents = Object.values(ChatEventEnum);

export const BOARDS = {
    GSEB: "GSEB",
    CBSE: "CBSE",
    ICSE: "ICSE",
};
export const AvailableBoards = Object.values(BOARDS);

export const SUBJECTS = {
    GUJARATI: "GUJARATI",
    HINDI: "HINDI",
    ENGLISH: "ENGLISH",
    // SCIENCE: "SCIENCE",
    // MATHEMATICS: "MATHEMATICS",
    // SOCIAL_SCIENCE: "SOCIAL_SCIENCE",
    // SANSKRIT: "SANSKRIT",
};
export const AvailableSubjects = Object.values(SUBJECTS);

export const MEDIUMS = {
    HINDI_MEDIUM: "HINDI_MEDIUM",
    ENGLISH_MEDIUM: "ENGLISH_MEDIUM",
    GUJARATI_MEDIUM: "GUJARATI_MEDIUM",
};
export const AvailableMediums = Object.values(MEDIUMS);

export const STANDARDS = {
    STD8: "STD8",
    STD9: "STD9",
    STD10: "STD10",
    STD11: "STD11",
    STD12: "STD12",
};
export const AvailableStandards = Object.values(STANDARDS);
