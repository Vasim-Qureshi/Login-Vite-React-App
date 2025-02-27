import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        setMessage(error.response?.data?.message || "Not authenticated");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? <p>Welcome, {user.username}</p> : <p>{message}</p>}
    </div>
  );
}

export default Profile;
