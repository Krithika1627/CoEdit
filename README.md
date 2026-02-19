# 🚀 CoEdit — Real-Time Collaborative Code Editor

CoEdit is a **real-time collaborative coding platform** that allows multiple users to join shared rooms and edit code together instantly.

Built using **React**, **Node.js**, **Socket.IO**, and **MongoDB**, it supports live synchronization, user presence tracking, and persistent room-based code storage.

---

## ✨ Features

### 👥 Collaboration
- Room-based collaboration using unique Room IDs
- Multiple users editing simultaneously
- Live code synchronization in real time

### 🧠 Presence Awareness
- Active user list
- Typing indicators
- Duplicate username prevention
- User join/leave notifications

### 💾 Persistence
- Code automatically saved in MongoDB
- Same room ID restores previous code
- Real-time updates stored continuously

### ⚡ Real-Time Communication
- WebSocket communication using Socket.IO
- Event-driven architecture
- Sync-code support for late joiners

---

## 🛠 Tech Stack

### Frontend
- React.js
- CodeMirror Editor
- Bootstrap
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose

---

## 🧱 Project Structure

```
CoEdit/
│
├── client/        # React frontend
│
├── server/        # Node + Socket.IO backend
│   ├── Room.js    # MongoDB schema
│   └── index.js   # Server logic
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Krithika1627/CoEdit.git
cd CoEdit
```

---

### 2️⃣ Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

---

### 3️⃣ Start MongoDB (Local)

```bash
brew services start mongodb-community
```

Check MongoDB:

```bash
mongosh
```

---

### 4️⃣ Run Backend

```bash
cd server
npm start
```

---

### 5️⃣ Run Frontend

```bash
cd client
npm start
```

App runs at:

```
http://localhost:3000
```

---

## 🧪 How It Works

### Real-Time Flow

```
User joins room
   ↓
Socket connection established
   ↓
Code changes emit events
   ↓
Server broadcasts updates
   ↓
All users sync instantly
```

---

### Persistent Storage Flow

```
code-change event
        ↓
MongoDB update (upsert)
        ↓
Room code stored
        ↓
Rejoining loads saved code
```

---

## 🧠 Learning Highlights

This project helped me understand:

- WebSocket-based real-time architecture
- Event-driven backend design
- Socket lifecycle management
- Multi-user state synchronization
- MongoDB persistence using upsert logic
- Debugging race conditions between frontend & sockets

---

## 🚀 Future Improvements

- Cursor synchronization
- Chat panel
- Code compiler integration
- Multi-language support
- Role-based permissions
- Cloud deployment

---

## 👩‍💻 Author

**Krithika V**  

GitHub: [@Krithika1627](https://github.com/Krithika1627)

---

## ⭐ Support

If you like this project, give it a star ⭐ on GitHub!
