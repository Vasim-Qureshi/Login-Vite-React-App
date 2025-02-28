import { useState } from "react";
import api from "../api";

function Logout() {
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("accessToken");
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
