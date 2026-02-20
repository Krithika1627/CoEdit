const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/coedit");

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB error:", err);
});

const Room = require("./Room");

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
};

io.on("connection", (socket) => {

    socket.on("join", async({ roomId, username }) => {
        console.log("User joining:", roomId, username); // ADD THIS

        const clients = getAllConnectedClients(roomId);

        const usernameTaken = clients.some(
            (client) => client.username === username
        );

        if (usernameTaken) {
            socket.emit("username-error", {
                message: "Username already taken",
            });
            return;
        }

        userSocketMap[socket.id] = username;
        
        socket.join(roomId);

        const updatedClients = getAllConnectedClients(roomId);

        updatedClients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients: updatedClients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on("code-change", async ({ roomId, code }) => {
        console.log("Code change from:", socket.id, "Room:", roomId);
    
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { $set: { code } },
                { upsert: true, new: true }
            );
    
            socket.to(roomId).emit("code-change", { code });
    
        } catch (error) {
            console.log("Error saving code:", error);
        }
    });
    
    
    socket.on("request-code", async ({ roomId }) => {
        console.log("Request-code received for:", roomId);

        try {
            const room = await Room.findOne({ roomId });
            console.log("DB result:", room);

            if (room) {
                socket.emit("load-code", { code: room.code });
            }
        } catch (error) {
            console.log("Error fetching room:", error);
        }
    });
    

    socket.on("user-typing", ({ roomId }) => {
        socket.to(roomId).emit("user-typing", {
            socketId: socket.id,
        });
    });

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
    });

    socket.on("send-message", ({ roomId, message }) => {
        const username = userSocketMap[socket.id];

        io.to(roomId).emit("receive-message", {
            username,
            message,
            time: new Date().toLocaleTimeString(),
        });
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log("server is running"));



const axios = require("axios");

app.use(express.json());

app.post("/compile", async (req, res) => {
    const { code, language_id } = req.body;

    try {
        // 1️⃣ submit code
        const submission = await axios.post(
            "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
            {
                source_code: code,
                language_id: language_id,
            }
        );

        res.json(submission.data);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Compilation failed" });
    }
});

