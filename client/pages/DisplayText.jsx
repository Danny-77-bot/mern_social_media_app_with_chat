import React from 'react';
import { useGetUserID } from '../src/hooks/useGetUserId';

export default function DisplayText({ messages, profiles }) {
  console.log("messages:", messages);
  console.log("profiles:", profiles);
const userId=useGetUserID();
  return (
    <div className='display-text'>
       {messages.map((message, index) => {
         const senderProfile = profiles.find(profile => profile.userOwner ===message.senderId);
         if (!senderProfile) {
           return null;
         }

         console.log("Sender profile image URL:", senderProfile.imageUrl);

         return (
           <div className='userinfo-box' key={index}>
             <div className='user-info-image'>
               {senderProfile.imageUrl ? (
                 <img
                   src={`http://localhost:3005/api/assets/uploads/${senderProfile.imageUrl}`}
                   alt={senderProfile.name}
                 />
               ) : (
                 <span>No image available</span>
               )}
             </div>
             <p>{message.text}</p>
           </div>
         );
       })}
    </div>
  );
}
