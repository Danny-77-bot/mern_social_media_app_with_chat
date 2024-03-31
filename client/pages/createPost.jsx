import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../src/hooks/useGetUserId";

const CreatePost = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [post, setPost] = useState({
    name: "",
    description: "",
    userOwner: userID,
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPost({ ...post, imageFile: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", post.name);
      formData.append("description", post.description);// Use postTime instead of cookingTime
      formData.append("userOwner", userID);
      formData.append("imageFile", post.imageFile);
      
      const response = await axios.post("http://localhost:3005/posts", formData);
      
      if (response.data) {
        alert("Post Created");
        navigate("/");
      } else {
        console.error("An error occurred:", response);
        alert("Failed to create post. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Failed to create post. Please try again later.");
    }
  };
  

  return (
    <div className="create-feed">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="name-box">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={post.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="description-box">
          <label>Description:</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="upload-box" >
          <label>Image:</label>
          <button onClick={()=>fileInputRef.current.click()}>upload</button>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;