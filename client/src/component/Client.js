import React from 'react'
import Avatar from 'react-avatar';

function Client({username, isActive}) {
  return (
    <div className={`client d-flex align-items-center mb-2 px-2 py-1 ${isActive?'active':''}`}>
        <Avatar name={username} size='40' round="10px" className='me-2'/>
        <span className='username-text'>{username}</span>
    </div>
  )
}

export default Client