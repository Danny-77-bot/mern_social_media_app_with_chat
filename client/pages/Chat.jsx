import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetUserID } from '../src/hooks/useGetUserId';
import DisplayText from './DisplayText';

export default function Chat() {
  const [profiles, setProfiles] = useState([]);
  const userID = useGetUserID();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3005/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfiles();
  }, []);

  const getConversationIds = async (userId, clickedUserId) => {
    console.log(userId, clickedUserId);
    try {
      const response = await axios.get(`http://localhost:3005/chats/${userId}/${clickedUserId}`);
      const chatData = response.data;

      if (chatData[0]?._id) {
        setChatId(chatData[0]?._id);
        fetchMessages(chatData[0]?._id); // Fetch messages when chatId is set
      } else {
        // Create a new chat if none exists
        const newChatResponse = await axios.post('http://localhost:3005/chats', {
          firstId: userId,
          secondId: clickedUserId
        });
        const newChat = newChatResponse.data;
        console.log(newChat._id);
        setChatId(newChat._id);
        setMessages([]); // Clear existing messages
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:3005/messages/${chatId}`);
      const text = response.data;
      setMessages(text);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = (clickedUserId) => {
    getConversationIds(userID, clickedUserId);
  };

  const handleInputText = (e) => {
    setNewMessage(e.target.value);
  };

  const sendNewMessage = async () => {
    try {
      if (chatId) {
        await axios.post('http://localhost:3005/messages', {
          chatId,
          senderId: userID,
          text: newMessage
        });
        console.log(newMessage); // Log the newMessage component
        setNewMessage(''); // Clear the new message input
      } else {
        console.log('No chat selected');
      }
    } catch (error) {
      console.log(error);
    }
  };

console.log(chatId);
  return (
    <div className="chat">
      <div className="chat-left-wrapper">
        <div className="chat-left">
          <h2>Choose a user to start chatting:</h2>
          {profiles.map((profile) => (
            profile.userOwner !== userID && (
              <div onClick={() => handleProfileClick(profile.userOwner)} key={profile._id}>
                <img
                  src={`http://localhost:3005/api/assets/uploads/${profile.imageUrl}`}
                  alt={profile.name}
                />
                <p>{profile.name}</p>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="chat-center-wrapper">
        <DisplayText messages={messages} profiles={profiles} />
        <div className="chat-center">
          <div className="chat-box-bottom">
            <textarea
              value={newMessage}
              onChange={handleInputText}
              placeholder="Write something"
            ></textarea>
            <button onClick={sendNewMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}