import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../src/hooks/useGetUserId";

const Home = () => {
const [posts, setPosts] = useState([]);
const [profiles, setProfiles] = useState([]);
const [isPostSaved, setIsPostSaved] = useState([]);
const userID =useGetUserID();

// Load saved posts and profiles on initial render
useEffect(() => { 
const fetchData = async () => {
try {
// Fetch profiles
const profilesResponse = await axios.get("http://localhost:3005/profiles");
setProfiles(profilesResponse.data);

// Fetch posts
const postsResponse = await axios.get("http://localhost:3005/posts");
setPosts(postsResponse.data);

// Fetch saved posts from local storage
const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
setIsPostSaved(savedPosts);
} catch (err) {
console.log(err);
}
};

fetchData();
}, []);

const savePost = async (postId) => {
try {
await axios.put("http://localhost:3005/posts/save", {
postId,
userID
});

// Update saved posts in local storage and state
const updatedSavedPosts = [...isPostSaved, postId];
localStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
setIsPostSaved(updatedSavedPosts);
} catch (error) {
console.log(error);
}
};

const deleteCreatedPost = async (postId) => {
try {
await axios.delete("http://localhost:3005/posts/deletePost", {
data: { userID, postId }
});

// Remove deleted post from saved posts in local storage and state
const updatedSavedPosts = isPostSaved.filter((savedPostId) => savedPostId !== postId);
localStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
setIsPostSaved(updatedSavedPosts);

// Remove deleted post from local state
setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
} catch (error) {
console.log(error);
}
};

return (
<div className="home-box">
{/* Display current user's profile */}
<div className="profile-wrapper">
{profiles.map((profile) => {
if(profile.userOwner===userID) {
return (
<div className="profile" key={profile._id}>
<img src={`http://localhost:3005/api/assets/uploads/${profile.imageUrl}`} alt={profile.name} />
<button>What's on your mind?</button>
<p>Photo</p>
</div>
);
}


return null;
})}

{/* Display current user's posts */}
{<ul className="post">
{posts.map((post) => {
if (post.userOwner === userID) {
return (
<li key={post._id}>
<div className="home-btn">
<div>
<button
onClick={() => savePost(post._id)}
disabled={isPostSaved.includes(post._id)}
style={{
backgroundColor: isPostSaved.includes(post._id) ? "rgba(0,0,0 , 0.5)" : "red"
}}
>
{isPostSaved.includes(post._id) ? "Saved" : "Save"}
</button>
</div>

<div>
{post.userOwner === userID && (
<button onClick={() => deleteCreatedPost(post._id)}>X</button>
)}
</div>
</div>

<div className="home-post-box">
<h2>{post.name}</h2>
<div className="desc">{post.description}</div>

{post.imageUrl && (
<img className="postimg"
src={`http://localhost:3005/api/assets/uploads/${post.imageUrl}`}
alt={post.name}
/>
)}
</div>
</li>
);
}
return null; // Add a return statement for the else case
})}
</ul> }
</div>
<hr/>
<div>
{profiles.map((profile) => {
if (profile.userOwner !== userID) {
return (
<div key={profile._id}>
<div className="profile">
<img src={`http://localhost:3005/api/assets/uploads/${profile.imageUrl}`} alt={profile.name} />
<p>{profile.name}</p>
</div>


<ul className="post">
{posts.map((post) => {
if (post.userOwner === profile.userOwner) {
return (
<li key={post._id}>

<div>
<button
onClick={() => savePost(post._id)}
disabled={isPostSaved.includes(post._id)}
style={{
backgroundColor: isPostSaved.includes(post._id) ? "rgba(0,0,0 , 0.5)" : "red"
}}
>
{isPostSaved.includes(post._id) ? "Saved" : "Save"}
</button>
</div>
<div className="home-post-box">
<h2>{post.name}</h2>
<div className="desc">{post.description}</div>
{post.imageUrl && (
<img
  src={`http://localhost:3005/api/assets/uploads/${post.imageUrl}`}
  alt={post.name}
/>
)}
</div>
</li>
);
}
return null;
})}
</ul>
</div>
);
}
return null;
})}
</div>

</div>
);
};

export default Home;
