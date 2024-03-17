// useGetChats.js

import { useEffect, useState } from "react";

const API = 'http://localhost:8080/';

const useGetChats = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(API + 'getUsers');
        const data = await res.json();
        if (!res.ok) {
          throw new Error('Failed to fetch chats');
        }
        if (!data.distinctUsers || !Array.isArray(data.distinctUsers)) {
          throw new Error('Invalid response format');
        }
        setChats(data.distinctUsers); 
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getChats();
  }, []);

  return { loading, chats };
};

export default useGetChats;
