import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../src/hooks/useGetUserId";

const CreateProfile = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [profile, setProfile] = useState({
    name: "",
    userOwner: userID || "", // Ensure userID is available
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfile({ ...profile, imageFile: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile.imageFile) {
      alert("Please select an image file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("imageFile", profile.imageFile);
      formData.append("name", profile.name);
      formData.append("userOwner", userID);

      const response = await axios.post("http://localhost:3005/profiles", formData);

      if (response.status === 201) {
        alert("Profile Created");
        navigate("/");
      } else {
        console.error("An error occurred:", response);
        alert("Failed to create profile. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Failed to create profile. Please try again later.");
    }
  };

  return (
    <div className="create-post">
      <div className="upload-box">
        <button onClick={() => fileInputRef.current.click()}>Upload</button>
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="name-box">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateProfile;
