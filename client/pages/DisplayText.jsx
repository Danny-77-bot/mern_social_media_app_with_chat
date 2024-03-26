import React from 'react'

export default function DisplayText({messages,profiles}) {
  return (
    <div className='display-text'>
       {messages?.map((message)=>{
            return <div className='userinfo-box'>
                <h2>{profiles.map((profile)=>{
                  return <div className='user-info-image'>
                    {profile.userOwner===message.senderId &&
                   <img
                   src={`http://localhost:3005/api/assets/uploads/${profile.imageUrl}`}
                   alt={profile.name}
                 />
                
                 }
                  </div>
                })}</h2>
                <h2>{message.text}</h2>
            </div>
       })}
    </div>
  )
}
