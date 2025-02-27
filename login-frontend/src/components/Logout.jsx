import { useState } from "react";
import axios from "axios";

function Logout() {
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setMessage("Logged out successfully");
    } catch (error) {
      setMessage("Logout failed");
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <p>{message}</p>
    </div>
  );
}

export default Logout;
