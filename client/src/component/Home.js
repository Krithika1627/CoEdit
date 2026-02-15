import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {v4 as uuid} from 'uuid';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [roomId,setRoomId]=useState('');
    const [username,setUsername]=useState('');
    const navigate=useNavigate();

    const generateRoomId=(e)=>{
        e.preventDefault();
        const id=uuid();
        setRoomId(id);
        toast.success("Room Id is generated :)");
    };

    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error('Fill both the fields :(');
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{username},
        });
        //toast.success("Room is created ;)");
    }

  return (
    <div className='container-fluid'>
        <div className='row justify-content-center align-items-center min-vh-100'>
            <div className='col-12 col-md-6'>
                <div className='card shadow-lg p-4 bg-card border-soft rounded-4'>
                    <div className='card-body text-center'>
                        <img className='img-fluid mx-auto d-block mb-3 opacity-100' src='/coedit.png' alt='img' style={{maxWidth:"140px"}}/>
                        <p className='text'>Edit code. Together. In real time.</p>
                        <h4 className='fw-semibold mb-3'>Join a Room</h4>
                        <div>
                            <input value={roomId} onChange={(e)=>setRoomId(e.target.value)} type='text' className='form-control mb-2 bg-dark text-light border-soft' placeholder='Room Id'/>
                            <input value={username} onChange={(e)=>setUsername(e.target.value)} type='text' className='form-control mb-2 bg-dark text-light border-soft' placeholder='Username'/>
                        </div>
                        <button onClick={joinRoom} className='btn btn-primary-custom btn-lg w-100'>Join</button>
                        <p className='mt-3 text'>Don't have a Room Id? <span className='text-primary fw-semibold ms-1' style={{cursor:'pointer'}} onClick={generateRoomId}>Create New Room</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home