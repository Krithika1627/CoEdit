import React, { useEffect, useRef, useState } from 'react'
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import {useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditorPage() {
    const [clients,setClients]=useState([]);
    const socketRef=useRef(null);
    const location=useLocation();
    const navigate=useNavigate();
    const {roomId}=useParams();
    const codeRef=useRef(null);
    const [activeUsers,setActiveUsers]=useState({});

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
            socketRef.current.on('joined',({clients,username,socketId})=>{
                if(username===location.state?.username){
                    toast.success('Joined room successfully :)');
                }
                if(username!==location.state?.username){
                    toast.success(`${username} joined`);
                }
                setClients([...clients]);
                socketRef.current.emit('sync-code',{
                    code:codeRef.current,
                    socketId,
                });
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
        };
        init();

        return()=>{
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    },[]);

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

            {/*editor*/}
            <div className='col-md-9 col-lg-10 d-flex flex-column h-100 p-0'>
                <div className="editor-shell h-100">
                    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>codeRef.current=code}/>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default EditorPage