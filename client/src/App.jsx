import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navvbar';
import Home from '../pages/Home';
import CreatePost from '../pages/createPost';
import SavedPosts from '../pages/SavedPosts';
import Register from '../pages/Register';
import Login from '../pages/Login';
import CreateProfile from '../pages/CreateProfile';
import Chat from '../pages/Chat';

const App = () => { // Corrected the component name to start with a capital letter
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create-profile" element={<CreateProfile/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/create-post" element={<CreatePost/>} />
         <Route path="/saved-posts" element={<SavedPosts/>} />
         <Route path="/messages" element={<Chat/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App; // Corrected the export statement
