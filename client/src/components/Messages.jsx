import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserId';

const Messages = ({ conversations }) => {
  
  const userID = useGetUserID();
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    // Find the selected conversation ID from conversations prop
    const selectedConversation = conversations.find(conversation => {
      return conversation.members.includes(userID);
    });
    if (selectedConversation) {
      setSelectedConversationId(selectedConversation._id);
    }
  }, [conversations, userID]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversationId) {
        try {
          const response = await axios.get(`http://localhost:3005/messages/${selectedConversationId}`);
          setMessages(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  return (
    <div className="messages">
      {/* Render messages */}
      {messages.map((message) => (
        <div key={message._id}>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
