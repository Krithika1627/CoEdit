import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: 5,
        timeout: 10000,
        transports: ["websocket"],
    };

    return io("http://localhost:5001", options);
};
