import React, { useEffect, useRef, useState } from 'react'
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import {useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Chat from './Chat';

function EditorPage() {
    const [clients,setClients]=useState([]);
    const socketRef=useRef(null);
    const location=useLocation();
    const navigate=useNavigate();
    const {roomId}=useParams();
    const codeRef=useRef(null);
    const [activeUsers,setActiveUsers]=useState({});

    const [language, setLanguage] = useState(63);
    const [output, setOutput] = useState("");

    const [socketReady, setSocketReady] = useState(false);

    const [running, setRunning] = useState(false);

    useEffect(()=>{
        const init= async ()=>{
            socketRef.current=await initSocket();
            socketRef.current.on('connect_error',(err)=>handleError(err));
            socketRef.current.on('connect_failed',(err)=>handleError(err));

            const handleError=(e)=>{
                console.log('socket error - ',e);
                toast.error("Socket connection failed");
                navigate('/');
            }

            socketRef.current.on('username-error',({message})=>{
                toast.error(message);
                socketRef.current.disconnect();
                navigate('/');
            });

            socketRef.current.emit('join',{
                roomId,
                username:location.state?.username,
            });
            socketRef.current.emit("request-code", { roomId });

            socketRef.current.on('joined',({clients,username,socketId})=>{
                if(username===location.state?.username){
                    toast.success('Joined room successfully :)');
                }
                if(username!==location.state?.username){
                    toast.success(`${username} joined`);
                }
                setClients([...clients]);

                if (socketId === socketRef.current.id) {
                    socketRef.current.emit("request-code", { roomId });
                }
            });

            socketRef.current.on('user-typing',({socketId})=>{
                if (socketId === socketRef.current.id) return;

                setActiveUsers((prev)=>({
                    ...prev,
                    [socketId]:true,
                }));
                setTimeout(()=>{
                    setActiveUsers((prev)=>{
                        const copy={...prev};
                        delete copy[socketId];
                        return copy;
                    });
                },2000);
            });

            socketRef.current.on('disconnected',({socketId,username})=>{
                toast.success(`${username} left`);
                setClients((prev)=>{
                    return prev.filter(
                        (client)=>client.socketId!=socketId
                    )
                })
            });
            setSocketReady(true);   
        };
        init();

        return()=>{
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    },[]);

    const runCode = async () => {

        setRunning(true); 

        try {
            const res = await fetch("http://localhost:5001/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: codeRef.current,
                    language_id: language,
                }),
            });
    
            const data = await res.json();
    
            setOutput(
                data.stdout ||
                data.stderr ||
                data.compile_output ||
                "No output"
            );
    
        } catch (err) {
            setOutput("Compilation error");
        }
        setRunning(false);
    };    

    if(!location.state){
        return <Navigate to='/'/>
    }

    const copyRoomId=async()=>{
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Copied');
        } catch (error) {
            toast.error('Unable to copy Room Id');
        }
    };

    const leaveRoom=()=>{
        navigate('/');
    }

  return (
    <div className='container-fluid vh-100'>
        <div className='row h-100'>
            {/*sidebar*/}
            <div className='col-md-3 col-lg-2 d-flex flex-column h-100 bg-card sidebar'>
                <div className='py-3 text-center'>
                    <img className='img-fluid mx-auto my-3' src='/coedit.png' alt='img' style={{maxWidth: "90px", opacity: 0.95}}/>
                </div>
                <hr className='border-soft my-2'/>
                {/*client list*/}
                <div className='flex-grow-1 px-3 overflow-auto'>
                <p className="text-muted-custom small mb-2">USERS</p>
                    {clients.map((client)=>(
                        <Client key={client.socketId} username={client.username} isActive={activeUsers[client.socketId]}/>
                    ))}
                </div>
                {/*button*/}
                <div className='p-3'>
                    <hr className='border-soft my-2'/>
                    <button onClick={copyRoomId} className='btn btn-primary-custom w-100 mb-2'>Copy Room Id</button>
                    <button onClick={leaveRoom} className='btn btn-outline-danger w-100'>Leave Room</button>
                </div>
            </div>

            {/* MAIN RIGHT AREA */}
            <div className="col-md-9 col-lg-10 main-editor-area p-0">

            {/* TOP SECTION (Editor + Output) */}
            <div className="top-section">

                {/* EDITOR SIDE */}
                <div className="editor-layout">

                    <div className="compiler-toolbar">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(Number(e.target.value))}
                        >
                            <option value={63}>JavaScript</option>
                            <option value={71}>Python</option>
                            <option value={54}>C++</option>
                            <option value={62}>Java</option>
                            <option value={50}>C</option>
                        </select>

                        <button onClick={runCode} disabled={running}>
                            {running ? "Running..." : "Run Code"}
                        </button>
                    </div>

                    <div className="editor-container">
                        {socketReady && (
                            <Editor
                                socketRef={socketRef}
                                roomId={roomId}
                                onCodeChange={(code) => (codeRef.current = code)}
                            />
                        )}
                    </div>

                </div>

                {/* OUTPUT PANEL (RIGHT SIDE) */}
                <div className="output-panel">
                    <h6>Output</h6>
                    <pre>{output}</pre>
                </div>

            </div>

            {/* CHAT BOTTOM */}
                <div className="chat-section">
                    {socketReady && (
                        <Chat socketRef={socketRef} roomId={roomId} />
                    )}
                </div>

            </div>

        </div> 
    </div>
  )
}

export default EditorPage