import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import { useGetUserID } from '../src/hooks/useGetUserId';
import DisplayText from './DisplayText';

export default function Chat() {
  const [profiles, setProfiles] = useState([]);
  const userID = useGetUserID();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [enlargedProfile, setEnlargedProfile] = useState(null); 

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("addNewUser", userID);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    socket.on("fetchMessages", (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("fetchMessages");
    };
  }, [socket, userID]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3005/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (recipientId) {
      getConversationIds(userID, recipientId);
    }
  }, [recipientId, userID]);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  const getConversationIds = async (userId, clickedUserId) => {
    setRecipientId(clickedUserId);
    try {
      const response = await axios.get(`http://localhost:3005/chats/${userId}/${clickedUserId}`);
      const chatData = response.data;

      if (chatData[0]?._id) {
        setChatId(chatData[0]._id);
      } else {
        const newChatResponse = await axios.post('http://localhost:3005/chats', {
          firstId: userId,
          secondId: clickedUserId
        });
        const newChat = newChatResponse.data;
        setChatId(newChat._id);
      }
    } catch (error) {
      console.error("Error fetching conversation IDs:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:3005/messages/${chatId}`);
      const text = response.data;
      setMessages(text);
      localStorage.setItem('messages', JSON.stringify(text));
    } catch (error) {
      console.error("Error fetching messages:", error);
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
        setNewMessage('');
        fetchMessages(chatId);
      } else {
        console.log('No chat selected');
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat">
      <div className="chat-left">
        <h2>Your Friends:</h2>
        {profiles.map((profile) => {
          if (profile.userOwner !== userID) {
            const isOnline = onlineUsers.some((user) => user.userId === profile.userOwner);
            return (
              <div className='profile-chat' onClick={() => handleProfileClick(profile.userOwner)} key={profile._id}>
                <div className='chat-image-box'>
                  <img
                    src={`http://localhost:3005/api/assets/uploads/${profile.imageUrl}`}
                    alt={profile.name}
                  />
                  <div className={isOnline ? 'online-sign' : null}></div>
                </div>
                <p>{profile.name}</p>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="chat-center">
        <DisplayText messages={messages} profiles={profiles} />
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
  );
}
