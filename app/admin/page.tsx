"use client"
import { getAll } from "@/helper/apiHandlers";
import {getData} from "@/helper/userData";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { userData } = getData();
  const [users, setUsers] = useState([]);
  console.log(userData);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // The correct endpoint should be "/api/users/allUsers"
        const response = await axios.get("/api/users/allUsers");
        setUsers(response.data);
        console.log(response.data); // Logs the list of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
fetchUsers();
  }, []);

  // if (data?.user.role !=="admin") return <p>Access Denied</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
