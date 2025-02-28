import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Prevent multiple calls

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        if (isMounted) {
          setUser(response.data.user);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error.response?.data?.message || "Not authenticated");
          setIsLoading(false);
        }
      }
    };

    if (isLoading) { // Prevent infinite loop
      fetchProfile();
    }

    return () => { isMounted = false; };
  }, [isLoading]);

  return (
    <div>
      <h2>Profile</h2>
      {user ? <p>Welcome, {user.username}</p> : <p>{message}</p>}
    </div>
  );
}

export default Profile;
