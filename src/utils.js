export const getPrivateChannelName = (myId, clientId) => {
    return clientId > myId
        ? `presence-${clientId}-${myId}`
        : `presence-${myId}-${clientId}`;
}

export const STATUS = {
    SENDING: "SENDING",
    DELIVERED: "DELIVERED",
    VIEWED : "VIEWED",
}