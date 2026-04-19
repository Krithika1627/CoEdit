import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: 5,
        timeout: 10000,
        transports: ["websocket"],
    };

    const BACKEND_URL =
        process.env.REACT_APP_BACKEND_URL || "https://coedit-clyc.onrender.com";

    return io(BACKEND_URL, options);
};