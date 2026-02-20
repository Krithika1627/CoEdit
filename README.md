# 🚀 CoEdit — Real-Time Collaborative Code Editor + Compiler

CoEdit is a real-time collaborative coding platform that allows multiple users to join shared rooms, edit code together instantly, chat live, and execute code directly inside the browser.

Built using **React, Node.js, Socket.IO, MongoDB, and Judge0**, it supports live synchronization, user presence tracking, chat communication, and integrated multi-language code execution.

---

## ✨ Features

### 👥 Real-Time Collaboration
- Room-based collaboration using unique Room IDs  
- Multiple users editing simultaneously  
- Live code synchronization in real time  
- Late joiners automatically receive latest code  

### 💬 Live Chat Panel
- Real-time room-based chat  
- Auto-scroll on new messages  
- Socket-powered message broadcasting  
- IDE-style chat layout  

### 🧠 Presence Awareness
- Active user list  
- Typing indicators  
- Duplicate username prevention  
- User join/leave notifications  

### 💻 Built-In Code Compiler
- Multi-language support  
- Run code directly inside the editor  
- Output panel on the right  
- Loading state while compiling  
- Error handling support  

Supported Languages:
- JavaScript  
- Python  
- C++  
- Java  
- C  

### 💾 Persistence
- Code automatically saved in MongoDB  
- Same room ID restores previous code  
- Real-time updates stored continuously  

### ⚡ Real-Time Communication
- WebSocket communication using Socket.IO  
- Event-driven backend architecture  
- Efficient room-based broadcasting  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- CodeMirror  
- Bootstrap  
- React Router  
- React Hot Toast  

### Backend
- Node.js  
- Express.js  
- Socket.IO  
- MongoDB + Mongoose  
- Judge0 API (Code Execution)  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Krithika1627/CoEdit.git  
cd CoEdit  
```

### 2️⃣ Install Dependencies

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
### 3️⃣ Start MongoDB (Local)
```bash
brew services start mongodb-community  
```
Check MongoDB:
```bash
mongosh
```

### 4️⃣ Run Backend
```bash
cd server  
npm start  
```
### 5️⃣ Run Frontend
```bash
cd client  
npm start  
```
App runs at:
```bash
http://localhost:3000  
```
---

## 🧪 How It Works

Real-Time Sync Flow:
```bash
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
Compiler Flow:
```bash
   Run Code clicked  
         ↓  
   Frontend sends code to backend  
         ↓  
   Backend calls Judge0 API  
         ↓  
   Compilation result returned  
         ↓  
   Output displayed in panel  
```
Persistent Storage Flow:
```bash
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

- WebSocket-based real-time architecture  
- Event-driven backend design  
- Socket lifecycle management  
- Multi-user state synchronization  
- MongoDB persistence using upsert logic  
- Cross-origin API handling (CORS)  
- Debugging race conditions between frontend & sockets  
- Complex flexbox-based IDE layout design  

---

## 🚀 Future Improvements

- Cursor synchronization  
- Resizable panels  
- Chat message bubble styling  
- Cloud deployment 
- Dockerized compiler environment  

---

## 👩‍💻 Author

Krithika V  
GitHub: https://github.com/Krithika1627  

---

## ⭐ Support

If you like this project, give it a star ⭐ on GitHub!
