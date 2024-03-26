import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [changeBack,setChangeBack]=useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  function changeBackGround() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    setChangeBack(true);
  }
  
  function resetBackGround() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    setChangeBack(false);
  }
  return (
    <div className="navbar">
        <img src={`/logo.png`} alt="logo" />
      {cookies.access_token && <Link to="/">Home</Link>}
      {cookies.access_token && <Link to="/create-profile">Profile</Link>}
      {cookies.access_token && <Link to="/create-post">Post</Link>}
      {cookies.access_token && <Link to="/saved-posts">Favorites</Link>}
      {cookies.access_token && <Link to="/messages">Messages</Link>}
      {!cookies.access_token && <Link to="/login">Login</Link>}
      {!cookies.access_token && <Link to="/register">Register</Link>}
      {cookies.access_token && <button onClick={logout}>Logout</button>}
      {cookies.access_token &&   <button onClick={changeBack ? resetBackGround : changeBackGround}>
        {changeBack ? "Light Mode" : "Dark Mode"}
      </button> }
    </div>
  );
};

export default Navbar;
