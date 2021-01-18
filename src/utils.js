export const getPrivateChannelName = (myId, clientId) => {
    return clientId > myId
        ? `presence-${clientId}-${myId}`
        : `presence-${myId}-${clientId}`;
}